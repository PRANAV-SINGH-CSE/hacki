import sys
import os
import time
import threading
import ctypes
import win32gui
import win32con
from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QVBoxLayout, QWidget, QGraphicsOpacityEffect, 
    QTextEdit, QPushButton, QHBoxLayout
)
from PyQt5.QtCore import Qt, pyqtSignal, QPropertyAnimation, QEasingCurve, QTimer
from PyQt5.QtGui import QFont, QColor
import keyboard
import mss
import mss.tools
import google.generativeai as genai
import pyautogui

# === CONFIGURATION ===
pyautogui.FAILSAFE = False
GEMINI_API_KEYS = [
    # Paste your keys here
 "AIzaSyCjb0oGMGAVi6SFj_T5Jea4iJp2Riz17Fg",
    "AIzaSyA6k5JIOKjL0XA0Kp8tHcxLyUX6ML7E6qk",
    "AIzaSyAVkRTuHEdvw3h_xlhGACsM7ZLSfHXPr4M",
    "AIzaSyDq8rYa0cnWHMdFdqv6Zat227DLpo7BPi0",
    "AIzaSyAuWJT1RRNK9fPP5JBvzsMqeNghD3Enan8",
    "AIzaSyBahQl2TM_JxgFKenmMq-wMCYxv_JUyh4U",
    "AIzaSyASC4ItFgYzfoEUdR-hOfbNW0_hNDgBh84"
]

CACHE_DIR = os.path.join(os.getenv("TEMP"), "img_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# Triggers
CORNER_THRESHOLD = 5
last_trigger_time = {"capture": 0, "solve": 0, "mcq": 0}
COOLDOWN = 2

# Self-Destruct
SELF_DESTRUCTED = False
esc_presses = []
ESC_PRESS_TIMEOUT = 2.0
ESC_PRESS_COUNT = 20
WDA_EXCLUDEFROMCAPTURE = 0x00000011

# Hide Console
ctypes.windll.kernel32.SetConsoleTitleW("Windows Defender Service")
if sys.executable.endswith(".exe"):
    ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)

# Helper: Check Hardware Key State
def is_key_down(code):
    return ctypes.windll.user32.GetAsyncKeyState(code) & 0x8000

# Screen Size
screen = QApplication.primaryScreen().geometry() if QApplication.instance() else None
if screen:
    screen_width = screen.width()
    screen_height = screen.height()
else:
    screen_width, screen_height = 1920, 1080

# ==================== CUSTOM DROP WIDGET ====================
class DropZone(QTextEdit):
    """
    Custom TextEdit that intercepts Drag & Drop events explicitly.
    """
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setAcceptDrops(True) # Force accept drops
        self.parent_window = parent

    def dragEnterEvent(self, event):
        # Accept if it's a file (Image) or Text
        if event.mimeData().hasUrls() or event.mimeData().hasText():
            event.acceptProposedAction()
        else:
            event.ignore()

    def dragMoveEvent(self, event):
        if event.mimeData().hasUrls() or event.mimeData().hasText():
            event.acceptProposedAction()
        else:
            event.ignore()

    def dropEvent(self, event):
        # Pass the event data back to the main window to handle
        if self.parent_window:
            self.parent_window.handle_drop(event.mimeData())
            event.acceptProposedAction()

# ==================== STEALTH OVERLAY ====================
class StealthOverlay(QMainWindow):
    update_signal = pyqtSignal(str)
    toggle_signal = pyqtSignal()
    status_signal = pyqtSignal(str)
    hide_signal = pyqtSignal()
    show_signal = pyqtSignal()
    opacity_signal = pyqtSignal(float)

    def __init__(self):
        super().__init__()
        self.drop_queue = [] 
        self.bg_opacity = 0.1 # Default Contrast (10%)
        
        self.init_ui()
        self.apply_stealth_styles()
        
        self.update_signal.connect(self.display_answer)
        self.toggle_signal.connect(self.toggle_visibility)
        self.status_signal.connect(self.update_status)
        self.hide_signal.connect(self.force_hide)
        self.show_signal.connect(self.force_show)
        self.opacity_signal.connect(self.update_background_opacity)
        
        self.setAcceptDrops(True)

    def init_ui(self):
        self.setWindowTitle("SECURE HUD")
        width = 400
        height = 350
        
        x = 30
        y = screen_height - height - 40 
        
        self.setGeometry(x, y, width, height)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)

        self.central = QWidget()
        self.setCentralWidget(self.central)
        layout = QVBoxLayout()
        layout.setContentsMargins(5, 5, 5, 5)
        self.central.setLayout(layout)

        # Set initial background
        self.update_background_opacity(self.bg_opacity)

        # --- Custom Drop Zone ---
        self.text_area = DropZone(self)
        self.text_area.setReadOnly(True)
        self.text_area.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.text_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.text_area.setFont(QFont("Consolas", 10, QFont.Bold))
        self.text_area.setStyleSheet("""
            QTextEdit {
                color: rgba(220, 220, 220, 255);
                background-color: transparent;
                border: 2px dashed rgba(80, 80, 80, 150);
                padding: 10px;
            }
        """)
        self.text_area.setText("☠️ DROP ZONE ACTIVE.\n\n[Drag Images or Text Here]\n\n[UP/DOWN] Contrast")
        
        self.opacity_effect = QGraphicsOpacityEffect()
        self.text_area.setGraphicsEffect(self.opacity_effect)
        self.fade_anim = QPropertyAnimation(self.opacity_effect, b"opacity")

        layout.addWidget(self.text_area)

        # --- Buttons ---
        btn_layout = QHBoxLayout()
        
        self.send_btn = QPushButton("SEND DATA [0]")
        self.send_btn.setFont(QFont("Consolas", 10, QFont.Bold))
        self.send_btn.setCursor(Qt.PointingHandCursor)
        self.send_btn.clicked.connect(self.trigger_solve)
        self.send_btn.setStyleSheet("""
            QPushButton {
                background-color: rgba(40, 40, 40, 200);
                color: #00FF00;
                border: 1px solid #00FF00;
                padding: 8px;
                border-radius: 4px;
            }
            QPushButton:hover { background-color: rgba(0, 255, 0, 50); }
            QPushButton:pressed { background-color: #00FF00; color: black; }
        """)
        
        self.clear_btn = QPushButton("CLR")
        self.clear_btn.setFixedWidth(50)
        self.clear_btn.setFont(QFont("Consolas", 10, QFont.Bold))
        self.clear_btn.setCursor(Qt.PointingHandCursor)
        self.clear_btn.clicked.connect(self.clear_queue)
        self.clear_btn.setStyleSheet("""
            QPushButton {
                background-color: rgba(60, 20, 20, 200);
                color: #FF5555;
                border: 1px solid #FF5555;
                padding: 8px;
                border-radius: 4px;
            }
            QPushButton:hover { background-color: rgba(255, 0, 0, 50); }
        """)

        btn_layout.addWidget(self.send_btn)
        btn_layout.addWidget(self.clear_btn)
        layout.addLayout(btn_layout)

        self.hide()

        self.top_timer = QTimer(self)
        self.top_timer.timeout.connect(self.enforce_top_most)
        self.top_timer.start(1000) 

    def update_background_opacity(self, opacity):
        self.bg_opacity = max(0.05, min(0.9, opacity))
        alpha = int(self.bg_opacity * 255)
        self.central.setStyleSheet(f"""
            QWidget {{
                background-color: rgba(0, 0, 0, {alpha});
                border-radius: 10px;
            }}
        """)

    def change_contrast(self, delta):
        new_op = self.bg_opacity + delta
        self.opacity_signal.emit(new_op)

    def enforce_top_most(self):
        if self.isVisible():
            hwnd = int(self.winId())
            win32gui.SetWindowPos(hwnd, win32con.HWND_TOPMOST, 0, 0, 0, 0,
                                  win32con.SWP_NOMOVE | win32con.SWP_NOSIZE | win32con.SWP_NOACTIVATE)

    # ================= LOGIC TO HANDLE DROPS =================
    def handle_drop(self, mime):
        """Called by the Custom DropZone or the Main Window"""
        added_count = 0
        
        # Priority 1: FILES (Images/Text Files)
        if mime.hasUrls():
            for url in mime.urls():
                file_path = url.toLocalFile()
                # Check extension to ensure it's a valid file type we want
                if file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.webp', '.txt')):
                    self.drop_queue.append({'type': 'image', 'data': file_path})
                    self.text_area.append(f"📄 FILE: {os.path.basename(file_path)}")
                    added_count += 1
        
        # Priority 2: PLAIN TEXT (Only if no files were found)
        elif mime.hasText():
            text = mime.text().strip()
            # Basic check to avoid file paths being treated as question text
            if text and not text.startswith("file:///"): 
                self.drop_queue.append({'type': 'text', 'data': text})
                preview = text[:20].replace("\n", " ") + "..."
                self.text_area.append(f"📝 TXT: {preview}")
                added_count += 1

        if added_count > 0:
            self.send_btn.setText(f"SEND DATA [{len(self.drop_queue)}]")

    # Also allow dropping on the window edges (fallback)
    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls() or event.mimeData().hasText():
            event.acceptProposedAction()

    def dropEvent(self, event):
        self.handle_drop(event.mimeData())
        event.acceptProposedAction()

    def clear_queue(self):
        self.drop_queue.clear()
        self.text_area.setText("🗑️ Queue Cleared.")
        self.send_btn.setText("SEND DATA [0]")

    def trigger_solve(self):
        if not self.drop_queue:
            self.update_status("❌ Queue is empty!")
            return
        
        self.send_btn.setText("SENDING...")
        self.send_btn.setEnabled(False)
        self.update_status("⏳ Sending to Neural Net...")
        
        queue_copy = self.drop_queue.copy()
        threading.Thread(target=solve_mixed_queue, args=(queue_copy,), daemon=True).start()
        
        self.drop_queue.clear()
        self.send_btn.setText("SEND DATA [0]")
        self.send_btn.setEnabled(True)

    def apply_stealth_styles(self):
        hwnd = int(self.winId())
        try: ctypes.windll.user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
        except: pass
        style = win32gui.GetWindowLong(hwnd, win32con.GWL_EXSTYLE)
        style = style | win32con.WS_EX_LAYERED | win32con.WS_EX_TOOLWINDOW
        style = style & ~win32con.WS_EX_APPWINDOW
        win32gui.SetWindowLong(hwnd, win32con.GWL_EXSTYLE, style)
        self.enforce_top_most()

    def display_answer(self, text):
        self.text_area.setText(text)
        if not self.isVisible(): self.force_show()

    def update_status(self, status):
        self.text_area.setText(status)

    def toggle_visibility(self):
        if self.isVisible(): self.hide()
        else: self.force_show()

    def force_hide(self):
        if self.isVisible(): self.hide()

    def force_show(self):
        self.show()
        self.opacity_effect.setOpacity(1.0)
        self.apply_stealth_styles()

# ==================== GEMINI LOGIC ====================
def send_to_gemini_mixed(content_list, model_name="gemini-2.5-flash"):
    for key in GEMINI_API_KEYS:
        try:
            genai.configure(api_key=key)
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(content_list)
            if response.text:
                return response.text
        except Exception as e:
            print(f"Key failed: {e}")
            continue
    raise Exception("All keys failed.")

def solve_mixed_queue(queue_items):
    gemini_payload = []
    system_prompt = """
    You are an expert exam solver. 
    Analyze the following images and text snippets.
    RULES:
    1. If multiple questions are present, solve them in sequence.
    2. Format output strictly as:
       1. <Option> <Text>
       2. <Option> <Text>
    3. NO explanations. NO markdown headers.
    """
    gemini_payload.append(system_prompt)

    has_content = False
    for item in queue_items:
        if item['type'] == 'text':
            gemini_payload.append(item['data'])
            has_content = True
        elif item['type'] == 'image':
            try:
                from PIL import Image
                img = Image.open(item['data'])
                gemini_payload.append(img)
                has_content = True
            except: pass

    if not has_content:
        overlay.status_signal.emit("❌ Failed to load content.")
        return

    try:
        ans = send_to_gemini_mixed(gemini_payload)
        overlay.update_signal.emit(ans)
    except Exception as e:
        overlay.status_signal.emit(f"❌ API Error: {str(e)}")

# ==================== POLLING & TRIGGERS ====================
def capture():
    try:
        with mss.mss() as sct:
            shot = sct.grab(sct.monitors[1])
            path = os.path.join(CACHE_DIR, f"cap_{int(time.time())}.png")
            mss.tools.to_png(shot.rgb, shot.size, output=path)
            
            overlay.drop_queue.append({'type': 'image', 'data': path})
            overlay.text_area.append(f"📸 SNAP: {os.path.basename(path)}")
            overlay.send_btn.setText(f"SEND DATA [{len(overlay.drop_queue)}]")
            overlay.force_show()
    except: pass

def check_corner_trigger(x, y):
    global last_trigger_time

    if x <= CORNER_THRESHOLD and y <= CORNER_THRESHOLD:
        overlay.hide_signal.emit()
        return

    if x >= screen_width - CORNER_THRESHOLD and y <= CORNER_THRESHOLD:
        overlay.show_signal.emit()
        return

    if x >= screen_width - CORNER_THRESHOLD and y >= screen_height - CORNER_THRESHOLD:
        if is_key_down(0x10): # Shift
            now = time.time()
            if now - last_trigger_time["capture"] > COOLDOWN:
                last_trigger_time["capture"] = now
                threading.Thread(target=capture, daemon=True).start()

def start_polling_loop():
    def loop():
        esc_was_down = False
        while True:
            try:
                x, y = pyautogui.position()
                check_corner_trigger(x, y)
            except: pass
            
            # ESC Toggle
            if is_key_down(0x1B):
                if not esc_was_down:
                    esc_was_down = True
                    overlay.toggle_signal.emit()
                    check_esc_press()
            else:
                esc_was_down = False
            time.sleep(0.05)
            
    threading.Thread(target=loop, daemon=True).start()

# ==================== SELF DESTRUCT ====================
def terminate_and_delete():
    global SELF_DESTRUCTED
    if SELF_DESTRUCTED: return
    SELF_DESTRUCTED = True
    import subprocess
    target = os.path.abspath(sys.argv[0])
    vbs = f'''Set f = CreateObject("Scripting.FileSystemObject")
    T = "{target}"
    WScript.Sleep 500
    On Error Resume Next
    f.DeleteFile T, True
    f.DeleteFile WScript.ScriptFullName, True'''
    try:
        p = os.path.join(os.getenv("TEMP"), "cln.vbs")
        with open(p, "w") as f: f.write(vbs)
        subprocess.Popen(['wscript.exe', p], creationflags=0x08000008)
    except: pass
    os._exit(0)

def check_esc_press():
    global esc_presses
    now = time.time()
    esc_presses = [t for t in esc_presses if now - t < ESC_PRESS_TIMEOUT]
    esc_presses.append(now)
    if len(esc_presses) >= ESC_PRESS_COUNT:
        threading.Thread(target=terminate_and_delete, daemon=True).start()

# ==================== MAIN ====================
if __name__ == "__main__":
    try:
        app = QApplication(sys.argv)
        overlay = StealthOverlay()
        
        start_polling_loop()
        
        # CONTRAST KEYS
        keyboard.add_hotkey("up", lambda: overlay.change_contrast(0.05))   # Darker
        keyboard.add_hotkey("down", lambda: overlay.change_contrast(-0.05)) # Lighter
        
        print("Ready.")
        sys.exit(app.exec_())
    except: sys.exit(0)