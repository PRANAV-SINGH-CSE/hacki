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

type GlobePoint = {
  size: number;
  order: number;
  color: string;
  lat: number;
  lng: number;
};

type GithubGlobeProps = {
  className?: string;
};

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

let ringIndexes = [0];

const hexToRgb = (hex: string) => {
  const normalized = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_match, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 234, b: 255 };
};

const genRandomNumbers = (min: number, max: number, count: number) => {
  const arr: number[] = [];

  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
};

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
  const [globeData, setGlobeData] = useState<GlobePoint[] | null>(null);
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

    const points: GlobePoint[] = [];
    data.forEach((arc) => {
      const rgb = hexToRgb(arc.color);
      const pointColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: pointColor,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: pointColor,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    });

    const filteredPoints = points.filter((point, index, arr) => {
      return arr.findIndex((candidate) => candidate.lat === point.lat && candidate.lng === point.lng) === index;
    });

    setGlobeData(filteredPoints);

    globeRef.current
      .hexPolygonsData((countries as { features: object[] }).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d: object) => (d as Position).startLat)
      .arcStartLng((d: object) => (d as Position).startLng)
      .arcEndLat((d: object) => (d as Position).endLat)
      .arcEndLng((d: object) => (d as Position).endLng)
      .arcColor((d: object) => (d as Position).color)
      .arcAltitude((d: object) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d: object) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((d: object) => (d as GlobePoint).color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((d: object) => (t: number) => {
        const point = d as GlobePoint;
        const rgb = hexToRgb(point.color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;
      })
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
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

  useEffect(() => {
    if (!globeRef.current || !globeData) return undefined;

    const interval = window.setInterval(() => {
      if (!globeRef.current || !globeData.length) return;

      ringIndexes = genRandomNumbers(0, globeData.length, Math.floor((globeData.length * 4) / 5));
      globeRef.current.ringsData(globeData.filter((_point, index) => ringIndexes.includes(index)));
    }, 2000);

    return () => {
      window.clearInterval(interval);
    };
  }, [globeData]);

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
