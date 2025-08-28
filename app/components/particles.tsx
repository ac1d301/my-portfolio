"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMousePosition } from "@/util/mouse";

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    refresh?: boolean;
}

export default function Particles({
    className = "",
    quantity = 60, // Reduced from 100 to 60
    staticity = 50,
    ease = 50,
    refresh = false,
}: ParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const shootingStars = useRef<any[]>([]);
    const mousePosition = useMousePosition();
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
        initCanvas();
        animate();
        window.addEventListener("resize", initCanvas);

        return () => {
            window.removeEventListener("resize", initCanvas);
        };
    }, []);

    useEffect(() => {
        onMouseMove();
    }, [mousePosition.x, mousePosition.y]);

    useEffect(() => {
        initCanvas();
    }, [refresh]);

    const initCanvas = () => {
        resizeCanvas();
        drawParticles();
    };

    const onMouseMove = () => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = mousePosition.x - rect.left - w / 2;
            const y = mousePosition.y - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                mouse.current.x = x;
                mouse.current.y = y;
            }
        }
    };

    type Circle = {
        x: number;
        y: number;
        translateX: number;
        translateY: number;
        size: number;
        alpha: number;
        targetAlpha: number;
        dx: number;
        dy: number;
        magnetism: number;
    };

    type ShootingStar = {
        x: number;
        y: number;
        dx: number;
        dy: number;
        size: number;
        alpha: number;
        trail: { x: number; y: number; alpha: number; size: number }[];
        life: number;
        maxLife: number;
    };

    const resizeCanvas = () => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            shootingStars.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;
            context.current.scale(dpr, dpr);
        }
    };

    const circleParams = (): Circle => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.5; // Slightly reduced particle size
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.7 + 0.2).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    };

    const shootingStarParams = (): ShootingStar => {
        const side = Math.floor(Math.random() * 4);
        let x, y, dx, dy;

        switch (side) {
            case 0: // Top
                x = Math.random() * canvasSize.current.w;
                y = -10;
                dx = (Math.random() - 0.5) * 6;
                dy = Math.random() * 4 + 3; // Faster movement
                break;
            case 1: // Right
                x = canvasSize.current.w + 10;
                y = Math.random() * canvasSize.current.h;
                dx = -(Math.random() * 4 + 3);
                dy = (Math.random() - 0.5) * 6;
                break;
            case 2: // Bottom
                x = Math.random() * canvasSize.current.w;
                y = canvasSize.current.h + 10;
                dx = (Math.random() - 0.5) * 6;
                dy = -(Math.random() * 4 + 3);
                break;
            default: // Left
                x = -10;
                y = Math.random() * canvasSize.current.h;
                dx = Math.random() * 4 + 3;
                dy = (Math.random() - 0.5) * 6;
        }

        return {
            x,
            y,
            dx,
            dy,
            size: Math.random() * 1.5 + 1.5, // Slightly larger shooting stars
            alpha: 1,
            trail: [],
            life: 0,
            maxLife: Math.random() * 80 + 40, // Longer lifespan
        };
    };

    const drawCircle = (circle: Circle, update = false) => {
        if (!context.current) return;
        
        const { x, y, translateX, translateY, size, alpha } = circle;
        context.current.translate(translateX, translateY);
        context.current.beginPath();
        context.current.arc(x, y, size, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.current.fill();
        context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!update) {
            circles.current.push(circle);
        }
    };

    const drawShootingStar = (star: ShootingStar) => {
        if (!context.current) return;
        
        // Draw elongated tail with gradient
        if (star.trail.length > 1) {
            context.current.beginPath();
            context.current.moveTo(star.trail[0].x, star.trail[0].y);
            
            // Create a smooth line through all trail points
            for (let i = 1; i < star.trail.length; i++) {
                const current = star.trail[i];
                const previous = star.trail[i - 1];
                const cpx = (current.x + previous.x) / 2;
                const cpy = (current.y + previous.y) / 2;
                context.current.quadraticCurveTo(previous.x, previous.y, cpx, cpy);
            }
            
            // Draw the main tail line
            context.current.strokeStyle = `rgba(255, 255, 255, ${star.alpha * 0.8})`;
            context.current.lineWidth = star.size;
            context.current.lineCap = "round";
            context.current.stroke();
            
            // Draw fading trail points
            star.trail.forEach((point, index) => {
                if (!context.current) return;
                
                const progress = index / star.trail.length;
                const trailAlpha = point.alpha * progress * 0.6;
                const trailSize = point.size * progress;
                
                if (trailAlpha > 0.05 && trailSize > 0.2) {
                    context.current.beginPath();
                    context.current.arc(point.x, point.y, trailSize, 0, 2 * Math.PI);
                    context.current.fillStyle = `rgba(255, 255, 255, ${trailAlpha})`;
                    context.current.fill();
                }
            });
        }

        // Draw bright head of the shooting star
        context.current.beginPath();
        context.current.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        context.current.fill();

        // Add bright glow around the head
        context.current.beginPath();
        context.current.arc(star.x, star.y, star.size * 3, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.2})`;
        context.current.fill();

        // Add intense core glow
        context.current.beginPath();
        context.current.arc(star.x, star.y, star.size * 1.5, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.4})`;
        context.current.fill();
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(
                0,
                0,
                canvasSize.current.w,
                canvasSize.current.h,
            );
        }
    };

    const drawParticles = () => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    };

    const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number,
    ): number => {
        const remapped =
            ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    const animate = () => {
        clearContext();

        // Animate particles
        circles.current.forEach((circle: Circle, i: number) => {
            const edge = [
                circle.x + circle.translateX - circle.size,
                canvasSize.current.w - circle.x - circle.translateX - circle.size,
                circle.y + circle.translateY - circle.size,
                canvasSize.current.h - circle.y - circle.translateY - circle.size,
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
            );
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX +=
                (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
                ease;
            circle.translateY +=
                (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
                ease;

            if (
                circle.x < -circle.size ||
                circle.x > canvasSize.current.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > canvasSize.current.h + circle.size
            ) {
                circles.current.splice(i, 1);
                const newCircle = circleParams();
                drawCircle(newCircle);
            } else {
                drawCircle(
                    {
                        ...circle,
                        x: circle.x,
                        y: circle.y,
                        translateX: circle.translateX,
                        translateY: circle.translateY,
                        alpha: circle.alpha,
                    },
                    true,
                );
            }
        });

        // Create new shooting stars more frequently
        if (Math.random() < 0.008) { // Increased from 0.003 to 0.008
            shootingStars.current.push(shootingStarParams());
        }

        // Animate shooting stars
        shootingStars.current.forEach((star, i) => {
            star.life++;
            star.x += star.dx;
            star.y += star.dy;
            
            // Add to trail with current position and size
            star.trail.push({ 
                x: star.x, 
                y: star.y, 
                alpha: star.alpha,
                size: star.size
            });
            
            // Keep longer trail for more realistic effect
            if (star.trail.length > 25) { // Increased from 15 to 25
                star.trail.shift();
            }

            // Fade out over time
            star.alpha = Math.max(0, 1 - (star.life / star.maxLife));

            drawShootingStar(star);

            // Remove dead shooting stars
            if (star.life > star.maxLife || 
                star.x < -100 || star.x > canvasSize.current.w + 100 ||
                star.y < -100 || star.y > canvasSize.current.h + 100) {
                shootingStars.current.splice(i, 1);
            }
        });

        window.requestAnimationFrame(animate);
    };

    return (
        <div className={className} ref={canvasContainerRef} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
