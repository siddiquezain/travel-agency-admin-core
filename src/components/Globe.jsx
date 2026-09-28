"use client";
import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

/* Realistic airplane SVG path (top-down silhouette). */
// Centered at 0,0 and drawn nose-first along +X so SVG `rotate="auto"`
// orients each plane forward along its flight path (not sideways).
const AIRPLANE_PATH =
    'M12,-2.5 L14,0 L12,2.5 L4,2 L1,10 L-1,10 L0,2 L-8,1.5 L-10,5 L-11.5,5 L-10,0 L-11.5,-5 L-10,-5 L-8,-1.5 L0,-2 L-1,-10 L1,-10 L4,-2 Z';

/* Flight orbit arcs - palette-matched. */
const FLIGHT_ARCS = [
    { rx: 310, ry: 128, rot: -18, color: '#2AB0E5', glow: '#2AB0E580', dur: 10, del: 0   },
    { rx: 295, ry: 100, rot: 30,  color: '#FBBF24', glow: '#FBBF2480', dur: 13, del: -3  },
    { rx: 315, ry: 138, rot: -46, color: '#34D399', glow: '#34D39980', dur: 15, del: -6  },
    { rx: 285, ry: 88,  rot: 44,  color: '#818CF8', glow: '#818CF880', dur: 11, del: -2  },
    { rx: 308, ry: 75,  rot: 10,  color: '#F87171', glow: '#F8717180', dur: 12, del: -5  },
    { rx: 300, ry: 115, rot: -34, color: '#FF6B35', glow: '#FF6B3580', dur: 14, del: -4  },
];

const ellipsePath = (cx, cy, rx, ry) =>
    `M ${cx - rx},${cy} a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 ${-rx * 2},0`;

const Globe = ({ width = 700, height = 700, className, style }) => {
    const canvasRef = useRef();
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);
    const visibleRef = useRef(true);
    const [reduceMotion, setReduceMotion] = useState(false);
    const SIZE = 750;

    /* Honour the OS "reduce motion" setting. */
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const apply = () => setReduceMotion(mq.matches);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    /* Freeze rotation and pause SVG animations while scrolled off-screen. */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                visibleRef.current = entry.isIntersecting;
                const svg = svgRef.current;
                if (svg) {
                    if (entry.isIntersecting) svg.unpauseAnimations();
                    else svg.pauseAnimations();
                }
            },
            { threshold: 0 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        let phi = 0;
        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: height * 2,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 3,
            mapSamples: 28000,
            mapBrightness: 1.8,
            baseColor: [0.95, 0.97, 1.0],
            markerColor: [0.165, 0.690, 0.898],
            glowColor: [0.88, 0.92, 1.0],
            markers: [
                { location: [17.385, 78.4867], size: 0.1 },
                { location: [21.4225, 39.8262], size: 0.08 },
                { location: [25.2048, 55.2708], size: 0.07 },
                { location: [24.4539, 54.3773], size: 0.06 },
                { location: [25.2854, 51.531], size: 0.06 },
                { location: [1.3521, 103.8198], size: 0.06 },
                { location: [3.139, 101.6869], size: 0.05 },
                { location: [13.7563, 100.5018], size: 0.05 },
                { location: [48.8566, 2.3522], size: 0.06 },
                { location: [51.5074, -0.1278], size: 0.06 },
                { location: [35.6762, 139.6503], size: 0.06 },
                { location: [40.7128, -74.006], size: 0.05 },
                { location: [-33.8688, 151.2093], size: 0.05 },
                { location: [41.0082, 28.9784], size: 0.06 },
                { location: [37.5665, 126.978], size: 0.05 },
                { location: [19.076, 72.8777], size: 0.07 },
                { location: [28.6139, 77.209], size: 0.06 },
                { location: [30.0444, 31.2357], size: 0.05 },
                { location: [-6.2088, 106.8456], size: 0.05 },
                { location: [39.9042, 116.4074], size: 0.06 },
            ],
            onRender: (state) => {
                if (!pointerInteracting.current && visibleRef.current && !reduceMotion)
                    phi += 0.003;
                state.phi = phi + pointerInteractionMovement.current;
                state.width = width * 2;
                state.height = height * 2;
            },
        });

        const handlePointerDown = (e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            canvasRef.current.style.cursor = 'grabbing';
        };
        const handlePointerUp = () => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = 'grab';
        };
        const handlePointerOut = () => {
            pointerInteracting.current = null;
            canvasRef.current.style.cursor = 'grab';
        };
        const handlePointerMove = (e) => {
            if (pointerInteracting.current !== null) {
                pointerInteractionMovement.current =
                    (e.clientX - pointerInteracting.current) / 200;
            }
        };

        const canvas = canvasRef.current;
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointerout', handlePointerOut);
        canvas.addEventListener('pointermove', handlePointerMove);

        return () => {
            globe.destroy();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointerout', handlePointerOut);
            canvas.removeEventListener('pointermove', handlePointerMove);
        };
    }, [width, height, reduceMotion]);

    const half = SIZE / 2;

    /* Park a plane on its orbit (point + tangent) for reduced-motion mode. */
    const staticPlane = (rx, ry, t) => {
        const px = half + rx * Math.cos(t);
        const py = half + ry * Math.sin(t);
        const angle =
            (Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) * 180) / Math.PI;
        return `translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${angle.toFixed(1)})`;
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'relative',
                width,
                height,
                maxWidth: '100%',
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', cursor: 'grab' }}
            />

            {/* Flight Arcs SVG Overlay */}
            <svg
                ref={svgRef}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'visible',
                }}
            >
                <defs>
                    {/* Per-arc colored glow - double layered */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <filter key={`fg-${i}`} id={`flight-glow-${i}`} x="-200%" y="-200%" width="500%" height="500%">
                            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={arc.color} floodOpacity="0.8" />
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={arc.color} floodOpacity="1" />
                        </filter>
                    ))}

                    {/* Soft trail glow */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <filter key={`tg-${i}`} id={`trail-glow-${i}`} x="-200%" y="-200%" width="500%" height="500%">
                            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={arc.color} floodOpacity="0.5" />
                        </filter>
                    ))}

                    {/* Airplane shadow filter */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <filter key={`as-${i}`} id={`airplane-shadow-${i}`} x="-200%" y="-200%" width="500%" height="500%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={arc.color} floodOpacity="0.6" />
                            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={arc.color} floodOpacity="0.35" />
                        </filter>
                    ))}

                    {/* Gradient arc strokes */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <linearGradient key={`g-${i}`} id={`arc-grad-${i}`}>
                            <stop offset="0%" stopColor={arc.color} stopOpacity="0" />
                            <stop offset="20%" stopColor={arc.color} stopOpacity="0.5" />
                            <stop offset="50%" stopColor={arc.color} stopOpacity="0.7" />
                            <stop offset="80%" stopColor={arc.color} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={arc.color} stopOpacity="0" />
                        </linearGradient>
                    ))}

                    {/* Radial glow around airplane */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <radialGradient key={`rg-${i}`} id={`dot-glow-${i}`}>
                            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                            <stop offset="35%" stopColor={arc.color} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={arc.color} stopOpacity="0" />
                        </radialGradient>
                    ))}

                    {/* Motion paths */}
                    {FLIGHT_ARCS.map((arc, i) => (
                        <path
                            key={`p-${i}`}
                            id={`orbit-${i}`}
                            d={ellipsePath(half, half, arc.rx, arc.ry)}
                            fill="none"
                        />
                    ))}
                </defs>

                {/* Render flight arcs */}
                {FLIGHT_ARCS.map((arc, i) => (
                    <g key={i} transform={`rotate(${arc.rot}, ${half}, ${half})`}>
                        {/* Orbit path - dashed gradient */}
                        <path
                            d={ellipsePath(half, half, arc.rx, arc.ry)}
                            fill="none"
                            stroke={`url(#arc-grad-${i})`}
                            strokeWidth="1.8"
                            strokeDasharray="16 12"
                            opacity="0.5"
                        />

                        {reduceMotion ? (
                            /* Static plane parked on the orbit */
                            <g
                                filter={`url(#airplane-shadow-${i})`}
                                transform={staticPlane(
                                    arc.rx,
                                    arc.ry,
                                    (i / FLIGHT_ARCS.length) * Math.PI * 2,
                                )}
                            >
                                <path
                                    d={AIRPLANE_PATH}
                                    fill="white"
                                    stroke={arc.color}
                                    strokeWidth="0.6"
                                    opacity="0.95"
                                    transform="scale(1.1)"
                                />
                            </g>
                        ) : (
                            <>
                                {/* Large trailing glow orb */}
                                <circle r="18" opacity="0.2" filter={`url(#trail-glow-${i})`}>
                                    <animate attributeName="fill" values={`${arc.color};${arc.glow};${arc.color}`} dur="2s" repeatCount="indefinite" />
                                    <animateMotion dur={`${arc.dur}s`} repeatCount="indefinite" begin={`${arc.del}s`}>
                                        <mpath href={`#orbit-${i}`} />
                                    </animateMotion>
                                </circle>

                                {/* Radial halo around airplane */}
                                <circle r="16" fill={`url(#dot-glow-${i})`} opacity="0.5">
                                    <animateMotion dur={`${arc.dur}s`} repeatCount="indefinite" begin={`${arc.del}s`}>
                                        <mpath href={`#orbit-${i}`} />
                                    </animateMotion>
                                </circle>

                                {/* Real airplane - detailed SVG silhouette */}
                                <g filter={`url(#airplane-shadow-${i})`}>
                                    <path
                                        d={AIRPLANE_PATH}
                                        fill="white"
                                        stroke={arc.color}
                                        strokeWidth="0.6"
                                        opacity="0.95"
                                        transform="scale(1.1)"
                                    >
                                        <animateMotion
                                            dur={`${arc.dur}s`}
                                            repeatCount="indefinite"
                                            begin={`${arc.del}s`}
                                            rotate="auto"
                                        >
                                            <mpath href={`#orbit-${i}`} />
                                        </animateMotion>
                                    </path>
                                </g>

                                {/* Colored fill airplane (layered behind white for depth) */}
                                <path
                                    d={AIRPLANE_PATH}
                                    fill={arc.color}
                                    opacity="0.15"
                                    transform="scale(1.4)"
                                >
                                    <animateMotion
                                        dur={`${arc.dur}s`}
                                        repeatCount="indefinite"
                                        begin={`${arc.del}s`}
                                        rotate="auto"
                                    >
                                        <mpath href={`#orbit-${i}`} />
                                    </animateMotion>
                                </path>

                                {/* Contrail / exhaust trail (small fading circles behind) */}
                                {[0.12, 0.24, 0.36].map((offset, j) => (
                                    <circle
                                        key={`trail-${i}-${j}`}
                                        r={4 - j * 1}
                                        fill={arc.color}
                                        opacity={0.2 - j * 0.05}
                                    >
                                        <animateMotion
                                            dur={`${arc.dur}s`}
                                            repeatCount="indefinite"
                                            begin={`${arc.del + offset}s`}
                                        >
                                            <mpath href={`#orbit-${i}`} />
                                        </animateMotion>
                                    </circle>
                                ))}
                            </>
                        )}
                    </g>
                ))}

                {/* Center pulse - Hyderabad origin */}
                {!reduceMotion && (
                    <>
                        <circle cx={half} cy={half} r="6" fill="none" stroke="#2AB0E5" strokeWidth="2.5" opacity="0.7">
                            <animate attributeName="r" values="6;28;6" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={half} cy={half} r="4" fill="none" stroke="#1A428A" strokeWidth="1.5" opacity="0.4">
                            <animate attributeName="r" values="4;18;4" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                        </circle>
                    </>
                )}
                <circle cx={half} cy={half} r="4" fill="#2AB0E5" opacity="0.9">
                    {!reduceMotion && (
                        <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
                    )}
                </circle>
            </svg>
        </div>
    );
};

export default Globe;
