"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ScrambleText from "./originkit/ScrambleText"
import MeshTextHover from "./originkit/MeshTextHover"

const TEXT = "BLACKPAW'S"
const TEXT_COLOR = "#e0e0e0"
const FRINGE_A = "#00ffff"
const FRINGE_B = "#ff00ff"
const SCRAMBLE_DURATION_S = 0.6
const SETTLE_HARD_TIMEOUT_MS = 10000
const FADE_MS = 400
// Stable module-level identity: ScrambleText re-runs its enter animation
// when its `font` prop identity changes (useLayoutEffect deps). An inline
// object literal would restart the scramble on every HeroTitleFX re-render
// (e.g. the `settled` flip right before the mesh shows).
const SCRAMBLE_FONT = { fontFamily: "Bebas Neue" }

/**
 * Hero name entrance + hover effect.
 *
 * Real h1 text (ScrambleText) stays in flow forever: it is the entrance
 * animation and the layout anchor (SEO / no-JS / a11y intact). MeshTextHover
 * is an additive WebGL2 overlay mounted from the start but kept at
 * opacity 0 until (a) the scramble has settled (DOM polling — survives
 * frozen CSS animation clocks) and (b) the canvas has drawn its first
 * frame. The DOM text then fades out; the canvas carries the glow via
 * drop-shadow. If WebGL2 is unavailable the canvas is never mounted and
 * the DOM text stays visible. prefers-reduced-motion: static text only.
 */
export default function HeroTitleFX(props: Record<string, unknown>) {
    const fxRef = useRef<HTMLDivElement | null>(null)

    // Both flags are decided post-hydration (effect), never in a useState
    // initializer: the first client render must match SSR exactly or React
    // throws hydration error 418. The boot sequence hides the hero for
    // ~4s anyway, so the one-frame delay is invisible.
    const [reducedMotion, setReducedMotion] = useState(false)
    const [webglOk, setWebglOk] = useState(false)

    useEffect(() => {
        setReducedMotion(
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
        // Decide once at mount. Never retry: if WebGL2 is unavailable the
        // canvas never mounts and the DOM text remains the final render.
        try {
            const c = document.createElement("canvas")
            setWebglOk(!!c.getContext("webgl2"))
        } catch {
            /* stays false */
        }
    }, [])

    const [settled, setSettled] = useState(false)
    const [firstFrame, setFirstFrame] = useState(false)
    const [fontPx, setFontPx] = useState(0)
    const [letterSpacingPx, setLetterSpacingPx] = useState(4)
    const [fontWeightPx, setFontWeightPx] = useState(700)
    const [wrapped, setWrapped] = useState(false)
    const settleTimerRef = useRef<number | null>(null)

    // Font size / letter-spacing / line wrap all live in CSS (clamp + media
    // queries). Measure the real computed values so the canvas raster
    // matches the DOM exactly, re-measuring on resize / DPR change.
    const measure = useCallback(() => {
        const root = fxRef.current
        if (!root) return
        const h1 = root.closest("h1")
        if (!h1) return
        const cs = getComputedStyle(h1)
        const size = parseFloat(cs.fontSize) || 0
        const spacing = parseFloat(cs.letterSpacing) || 0
        const lineH = parseFloat(cs.lineHeight) || 0
        setFontPx(size)
        setLetterSpacingPx(spacing)
        setFontWeightPx(
            Number(cs.fontWeight) || 700
        )
        // Bebas at clamp(72px,15vw,200px) wraps on narrow viewports — the
        // mesh only makes sense on a single line.
        setWrapped(
            lineH > 0 &&
                root.getBoundingClientRect().height > lineH * 1.6
        )
    }, [])

    useEffect(() => {
        measure()
        const ro = new ResizeObserver(measure)
        if (fxRef.current) ro.observe(fxRef.current)
        window.addEventListener("resize", measure)
        let mq: MediaQueryList | null = null
        const dpr = window.devicePixelRatio || 1
        try {
            mq = window.matchMedia(`(resolution: ${dpr}dppx)`)
            mq.addEventListener?.("change", measure)
        } catch {
            /* ignore */
        }
        return () => {
            ro.disconnect()
            window.removeEventListener("resize", measure)
            mq?.removeEventListener?.("change", measure)
        }
    }, [measure])

    // Scramble completion = DOM polling. The one-line build hides
    // unreached chars (display:none) and renders in-flight chars as
    // glitch glyphs; the ghost measurement layer is visibility:hidden.
    // Settled = we first OBSERVED the scramble (join !== final text) and
    // then the visible leaf spans' text equals the final text exactly.
    // A hard timeout force-settles (frozen clocks / SwiftShader): the
    // canvas renders the final text, so it covers any stuck scramble.
    useEffect(() => {
        if (reducedMotion || settled) return
        let sawAnim = false
        let attempts = 0
        const iv = window.setInterval(() => {
            const root = fxRef.current
            if (!root) return
            if (root.getBoundingClientRect().height === 0) return // boot still running
            const spans = Array.from(
                root.querySelectorAll<HTMLSpanElement>("span")
            ).filter((s) => {
                const cs = getComputedStyle(s)
                return (
                    cs.visibility !== "hidden" &&
                    cs.display !== "none" &&
                    s.childElementCount === 0
                )
            })
            const joined =
                spans.length > 0
                    ? spans.map((s) => s.textContent ?? "").join("")
                    : ""
            if (!sawAnim && joined !== TEXT) sawAnim = true
            if (sawAnim && joined === TEXT) {
                // Let the scramble's final letter animation actually finish
                // before the mesh takes over (grace period).
                clearInterval(iv)
                settleTimerRef.current = window.setTimeout(() => {
                    setSettled(true)
                }, 1000)
                return
            }
            attempts++
            if (attempts * 100 >= SETTLE_HARD_TIMEOUT_MS) {
                setSettled(true)
                clearInterval(iv)
            }
        }, 100)
        return () => {
            clearInterval(iv)
            if (settleTimerRef.current) {
                clearTimeout(settleTimerRef.current)
                settleTimerRef.current = null
            }
        }
    }, [reducedMotion, settled])

    if (reducedMotion) {
        return <span {...props}>{TEXT}</span>
    }

    // The canvas must have drawn its first frame before the DOM text
    // goes transparent — no empty-name flash if fonts race the first draw.
    const showMesh = settled && firstFrame && webglOk && !wrapped

    return (
        <div
            {...props}
            ref={fxRef}
            className="hero-title-fx"
            style={{ position: "relative" }}
        >
            <div
                className="hero-title-text"
                style={{
                    opacity: showMesh ? 0 : 1,
                    transition: `opacity ${FADE_MS}ms ease`,
                }}
            >
                <ScrambleText
                    words={TEXT}
                    color={TEXT_COLOR}
                    font={SCRAMBLE_FONT}
                    tag="span"
                    charSpacing="inherit"
                    overflow="visible"
                    enterAnimation={{
                        mode: "oneLine",
                        restState: "solid",
                        replay: false,
                        position: "above",
                        scrambleIntensity: 100,
                        ease: {
                            type: "tween",
                            duration: SCRAMBLE_DURATION_S,
                            ease: "easeOut",
                        },
                        flickerEnabled: false,
                    }}
                    hoverAnimation={{ type: "none" }}
                />
            </div>
            <div
                className="hero-title-canvas"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    opacity: showMesh ? 1 : 0,
                    pointerEvents: showMesh ? "auto" : "none",
                    transition: `opacity ${FADE_MS}ms ease`,
                    filter: showMesh
                        ? "drop-shadow(0 0 18px rgba(255, 32, 32, 0.3)) drop-shadow(0 0 70px rgba(255, 32, 32, 0.12))"
                        : "none",
                }}
            >
                {webglOk && (
                    <MeshTextHover
                        text={TEXT}
                        color={TEXT_COLOR}
                        font={{
                            fontFamily: "Bebas Neue",
                            fontSize: fontPx,
                            lineHeight: "1em",
                            fontWeight: fontWeightPx,
                            variant: "Regular",
                        }}
                        letterSpacing={letterSpacingPx}
                        colorSplit
                        customColors={[FRINGE_A, FRINGE_B]}
                        force={18}
                        onFirstFrame={() => setFirstFrame(true)}
                    />
                )}
            </div>
        </div>
    )
}
