import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Fog, Group, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import countries from "../../data/globe.json";

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

type WorldProps = {
  globeConfig: GlobeConfig;
  data: Position[];
};

type GithubGlobeProps = {
  className?: string;
};

const cameraZ = 300;


const WebGLRendererConfig = () => {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size.height, size.width]);

  return null;
};

const Globe = ({ globeConfig, data }: WorldProps) => {
  const groupRef = useRef<Group | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#00eaff",
      showAtmosphere: true,
      atmosphereAltitude: 0.14,
      polygonColor: "rgba(0, 234, 255, 0.62)",
      globeColor: "#03151d",
      emissive: "#001a24",
      emissiveIntensity: 0.18,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  useEffect(() => {
    if (!groupRef.current || globeRef.current) return;

    const group = groupRef.current;
    const globe = new ThreeGlobe();
    globeRef.current = globe;
    group.add(globe);
    setIsInitialized(true);

    return () => {
      group.remove(globe);
      globeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };

    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.globeColor,
    defaultProps.shininess,
    isInitialized,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    globeRef.current
      .hexPolygonsData((countries as { features: object[] }).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    // Disable arcs and connecting lines entirely
    globeRef.current.arcsData([]);

    // Disable endpoint dots
    globeRef.current.pointsData([]);

    // Ensure rings are disabled as well
    globeRef.current.ringsData([]);
  }, [
    data,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.atmosphereAltitude,
    defaultProps.atmosphereColor,
    defaultProps.maxRings,
    defaultProps.pointSize,
    defaultProps.polygonColor,
    defaultProps.rings,
    defaultProps.showAtmosphere,
    isInitialized,
  ]);

  return <group ref={groupRef} />;
};

const World = (props: WorldProps) => {
  const { globeConfig } = props;
  const scene = useMemo(() => {
    const nextScene = new Scene();
    nextScene.fog = new Fog(0xffffff, 400, 2000);
    return nextScene;
  }, []);

  return (
    <Canvas scene={scene} camera={{ fov: 50, aspect: 1, near: 180, far: 1800, position: [0, 0, cameraZ] }}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};

const sampleArcs: Position[] = [
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.3,
    color: "#00eaff",
  },
  {
    order: 1,
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.22,
    color: "#8a54ff",
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.18,
    color: "#00eaff",
  },
  {
    order: 2,
    startLat: 40.7128,
    startLng: -74.006,
    endLat: -23.5505,
    endLng: -46.6333,
    arcAlt: 0.26,
    color: "#c451ff",
  },
  {
    order: 3,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.34,
    color: "#00eaff",
  },
  {
    order: 3,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 25.2048,
    endLng: 55.2708,
    arcAlt: 0.2,
    color: "#7cefff",
  },
];

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#03151d",
  showAtmosphere: true,
  atmosphereColor: "#00eaff",
  atmosphereAltitude: 0.12,
  emissive: "#001a24",
  emissiveIntensity: 0.16,
  shininess: 0.9,
  polygonColor: "rgba(0, 234, 255, 0.58)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#00eaff",
  pointLight: "#c451ff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.8,
};

const GithubGlobe = ({ className }: GithubGlobeProps) => {
  return (
    <div className={className}>
      <World globeConfig={globeConfig} data={sampleArcs} />
    </div>
  );
};

export default GithubGlobe;
