import React, { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

const GameCard = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let mouseX = canvas.width / 2;

    // Game objects
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      width: 30,
      height: 30,
      color: "#60a5fa",
    };

    const bullets = [];
    const enemies = [];
    const bulletSpeed = 7;
    const enemySpeed = 2;

    // Create initial enemies
    for (let i = 0; i < 8; i++) {
      enemies.push({
        x: i * 60 + 50,
        y: 50,
        width: 25,
        height: 25,
        dx: enemySpeed,
        timeOffset: i * 200,
      });
    }

    // Mouse movement handler
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      player.x = Math.max(
        player.width / 2,
        Math.min(canvas.width - player.width / 2, mouseX)
      );
    };

    // Shoot handler
    const handleClick = () => {
      if (!gameOver) {
        bullets.push({
          x: player.x,
          y: player.y - 10,
          width: 4,
          height: 10,
        });
      }
    };

    if (gameStarted) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("click", handleClick);
    }

    const drawPlayer = () => {
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(player.x - 15, player.y + 30);
      ctx.lineTo(player.x + 15, player.y + 30);
      ctx.closePath();
      ctx.fillStyle = player.color;
      ctx.fill();
    };

    const drawEnemies = () => {
      enemies.forEach((enemy) => {
        const time = Date.now();
        enemy.x += enemy.dx;
        enemy.y = 50 + Math.sin((time + enemy.timeOffset) / 500) * 30;

        if (enemy.x <= 0 || enemy.x >= canvas.width) {
          enemy.dx *= -1;
        }

        ctx.fillStyle = "#f87171";
        ctx.fillRect(
          enemy.x - enemy.width / 2,
          enemy.y - enemy.height / 2,
          enemy.width,
          enemy.height
        );
      });
    };

    const drawBullets = () => {
      bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        ctx.fillStyle = "#34d399";
        ctx.fillRect(
          bullet.x - bullet.width / 2,
          bullet.y,
          bullet.width,
          bullet.height
        );

        if (bullet.y < 0) bullets.splice(index, 1);

        enemies.forEach((enemy, enemyIndex) => {
          if (
            bullet.x < enemy.x + enemy.width / 2 &&
            bullet.x > enemy.x - enemy.width / 2 &&
            bullet.y < enemy.y + enemy.height / 2 &&
            bullet.y > enemy.y - enemy.height / 2
          ) {
            bullets.splice(index, 1);
            enemies.splice(enemyIndex, 1);
            setScore((prev) => prev + 100);
          }
        });
      });
    };

    const checkGameOver = () => {
      enemies.forEach((enemy) => {
        if (
          Math.abs(enemy.x - player.x) < (player.width + enemy.width) / 2 &&
          Math.abs(enemy.y - player.y) < (player.height + enemy.height) / 2
        ) {
          setGameOver(true);
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!gameStarted) {
        ctx.fillStyle = "#60a5fa";
        ctx.font = "24px Arial";
        ctx.fillText(
          "Click Start to Play",
          canvas.width / 2 - 80,
          canvas.height / 2
        );
        return;
      }

      if (!gameOver) {
        drawPlayer();
        drawEnemies();
        drawBullets();
        checkGameOver();
      }

      if (enemies.length === 0) {
        ctx.fillStyle = "#34d399";
        ctx.font = "24px Arial";
        ctx.fillText("You Win!", canvas.width / 2 - 40, canvas.height / 2);
      }

      if (gameOver) {
        ctx.fillStyle = "#f87171";
        ctx.font = "24px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (gameStarted) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("click", handleClick);
      }
    };
  }, [gameOver, gameStarted]);

  const handleReset = () => {
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  const handleStart = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
    }
  };

  return (
    <div
      className="max-w-md mx-auto p-6 bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl 
      border border-gray-700 hover:border-blue-500/20 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-100">Space Shooter</h2>
        <div className="flex items-center gap-4">
          <div className="text-blue-400">Score: {score}</div>
          {!gameStarted ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg 
                hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg 
                hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="relative rounded-lg overflow-hidden bg-gray-900/50">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="border border-gray-700 rounded-lg"
        />
        <div
          className="absolute bottom-4 left-4 text-gray-300 text-sm bg-gray-900/80 
          backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700"
        >
          Move mouse to control • Click to shoot
        </div>
      </div>
    </div>
  );
};

export default GameCard;
