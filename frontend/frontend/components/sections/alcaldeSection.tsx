"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";

export default function HighlightSection() {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // DETECT MOBILE
  const [isMobile, setIsMobile] = useState(false);

  // GAME
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // PLAYER
  const [jumping, setJumping] = useState(false);
  const [positionY, setPositionY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [rotation, setRotation] = useState(0);

  // OBSTACLE
  const [obstacleX, setObstacleX] = useState(1000);
  const [obstacleFalling, setObstacleFalling] = useState(false);
  const [obstacleRotation, setObstacleRotation] = useState(0);
  const [obstacleY, setObstacleY] = useState(0);

  // SPEED
  const [gameSpeed, setGameSpeed] = useState(8);

  const gravity = 0.9;

  const alcaldeRef = useRef<HTMLImageElement | null>(null);
  const obstacleRef = useRef<HTMLDivElement | null>(null);

  // CHECK MOBILE
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // LOAD IMAGE
  useEffect(() => {
    async function loadAlcalde() {
      try {
        const res = await api.get("api/website-images/alcalde");

        if (res.data.length > 0) {
          setImageUrl(res.data[0].imageUrl);
        }
      } catch (error) {
        console.error("Error cargando imagen del alcalde");
      }
    }

    loadAlcalde();
  }, []);

  // GAME LOOP (DESKTOP ONLY)
  useEffect(() => {
    if (isMobile) return;
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setGameSpeed((prev) => Math.min(prev + 0.002, 25));
      setScore((prev) => prev + 1);

      setObstacleX((prev) => {
        if (prev < -100) {
          return window.innerWidth;
        }
        return prev - gameSpeed;
      });

      setVelocity((prev) => prev - gravity);

      setPositionY((prev) => {
        const next = prev + velocity;

        if (next <= 0) {
          setJumping(false);
          setRotation(0);
          setVelocity(0);
          return 0;
        }

        return next;
      });

      if (jumping) {
        setRotation((prev) => prev + 18);
      }

      if (obstacleFalling) {
        setObstacleY((prev) => prev + 10);
        setObstacleRotation((prev) => prev + 8);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [
    isMobile,
    gameStarted,
    gameOver,
    velocity,
    gameSpeed,
    jumping,
    obstacleFalling,
  ]);

  // COLLISION (DESKTOP ONLY)
  useEffect(() => {
    if (isMobile) return;
    if (!gameStarted || gameOver) return;

    const collisionInterval = setInterval(() => {
      if (!alcaldeRef.current || !obstacleRef.current) return;

      const alcaldeRect = alcaldeRef.current.getBoundingClientRect();
      const obstacleRect = obstacleRef.current.getBoundingClientRect();

      const collision =
        alcaldeRect.right > obstacleRect.left &&
        alcaldeRect.left < obstacleRect.right &&
        alcaldeRect.bottom > obstacleRect.top &&
        alcaldeRect.top < obstacleRect.bottom;

      if (collision) {
        setGameOver(true);
        setObstacleFalling(true);
      }
    }, 20);

    return () => clearInterval(collisionInterval);
  }, [isMobile, gameStarted, gameOver]);

  const jump = () => {
    if (isMobile) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    if (gameOver) {
      restartGame();
      return;
    }

    if (!jumping) {
      setJumping(true);
      setVelocity(48);
    }
  };

  const restartGame = () => {
    setGameStarted(true);
    setGameOver(false);

    setScore(0);
    setPositionY(0);
    setVelocity(0);

    setObstacleX(window.innerWidth);
    setObstacleFalling(false);
    setObstacleRotation(0);
    setObstacleY(0);

    setGameSpeed(8);
  };

  if (!imageUrl) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white md:pt-18">
      {/* BLOQUEO TOTAL EN MÓVIL */}
      {isMobile && (
        <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto" />
      )}

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/fondo-ciudad.jpg"
          alt="background"
          className="h-full w-full object-cover blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-transparent" />
      </div>

      {/* SCORE */}
      {gameStarted && !isMobile && (
        <div className="absolute right-6 top-6 z-50 rounded-lg bg-black/70 px-4 py-2 text-lg font-bold text-white">
          SCORE: {score}
        </div>
      )}

      {/* START MESSAGE SOLO DESKTOP */}
      {!gameStarted && !isMobile && (
        <div
          onClick={jump}
          className="absolute inset-0 z-40 flex cursor-pointer top-10 justify-center"
        >
          <h2 className="mb-2 text-2xl font-bold text-center">
            Juega con el Alcalde!
            <p className="text-lg">
              El alcalde necesita llegar a la municipalidad! AYUDALO!!
            </p>
          </h2>
        </div>
      )}

      {/* GAME OVER */}
      {gameOver && !isMobile && (
        <div
          onClick={restartGame}
          className="absolute inset-0 z-50 flex cursor-pointer items-center justify-center"
        >
          <div className="rounded-2xl bg-red-600/90 px-8 py-6 text-center text-white shadow-2xl">
            <h2 className="mb-2 text-3xl font-bold">GAME OVER</h2>
            <p className="mb-2 text-md">Puntaje: {score}</p>
           
          </div>
        </div>
      )}

      {/* OBSTACLE SOLO DESKTOP */}
      {!isMobile && (
        <div
          ref={obstacleRef}
          className="absolute bottom-0 z-20 h-20 w-12 rounded-md bg-red-500"
          style={{
            left: obstacleX,
            transform: `translateY(${obstacleY}px) rotate(${obstacleRotation}deg)`,
            transition: obstacleFalling
              ? "none"
              : "transform 0.05s linear",
          }}
        />
      )}

      <div className="container-main relative z-10">
        {/* MOBILE */}
        <div className="space-y-6 md:hidden">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Mensaje del Alcalde"
              className="w-64 select-none object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold text-[#1a3a5c]">
            Mensaje del Alcalde
          </h2>

          <p className="text-lg text-gray-700">
            El alcalde lidera con compromiso la gestión municipal,
            promoviendo desarrollo sostenible y bienestar ciudadano.
          </p>

          <div className="flex justify-end pb-10">
            <button
              onClick={() => router.push("/ciudad")}
              className="rounded-lg bg-[#1a3a5c] px-6 py-3 text-white shadow-md transition hover:bg-[#15304d]"
            >
              Más de la ciudad
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden items-end md:flex">
          <img
            ref={alcaldeRef}
            src={imageUrl}
            alt="Mensaje del Alcalde"
            onClick={jump}
            className="relative z-30 w-[500px] cursor-pointer select-none object-contain"
            style={{
              transform: `translateY(${-positionY}px) rotate(${rotation}deg)`,
              transition: jumping
                ? "none"
                : "transform 0.1s linear",
            }}
          />

          <div className="relative ml-[-50px] flex-1">
            <div className="bg-[#1a3a5c] px-12 py-10 text-white shadow-xl -skew-x-6">
              <div className="skew-x-6">
                <h2 className="text-5xl font-bold">
                  Mensaje del Alcalde
                </h2>
              </div>
            </div>

            <div className="ml-12 mt-[-25px] bg-gray-100/95 px-12 py-10 shadow-lg backdrop-blur-sm -skew-x-6">
              <div className="skew-x-6">
                <p className="mb-4 text-lg leading-relaxed text-gray-700">
                  El alcalde lidera con compromiso la gestión municipal,
                  promoviendo desarrollo sostenible y bienestar ciudadano.
                </p>

                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                  Su gestión impulsa proyectos estratégicos en seguridad,
                  infraestructura y participación vecinal.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => router.push("/ciudad")}
                    className="rounded-lg bg-[#1a3a5c] px-6 py-3 text-white shadow-md transition hover:bg-[#15304d]"
                  >
                    Más de la ciudad
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FLOOR */}
        {!isMobile && (
          <div className="mt-4 h-2 w-full bg-gray-500 opacity-50" />
        )}
      </div>
    </section>
  );
}