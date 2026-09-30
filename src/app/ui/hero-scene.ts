import { ChangeDetectionStrategy, Component } from '@angular/core';

interface SwimmingFish {
  y: number;
  s: number;
  dur: number;
  delay: number;
  flip?: boolean;
}

/**
 * Full-bleed underwater scene behind the home page hero: light shafts through
 * the surface, a school of fish crossing, bubbles from an air stone. Purely
 * decorative (hidden from assistive technology); every movement stops under
 * reduced motion.
 */
@Component({
  selector: 'sx-hero-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="hs-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0f5552" />
          <stop offset="0.45" stop-color="#0a3a3c" />
          <stop offset="1" stop-color="#041a1c" />
        </linearGradient>
        <radialGradient id="hs-sun" cx="0.72" cy="-0.05" r="0.55">
          <stop offset="0" stop-color="#ffe3a3" stop-opacity="0.55" />
          <stop offset="0.4" stop-color="#7fe0c6" stop-opacity="0.16" />
          <stop offset="1" stop-color="#7fe0c6" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="hs-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d9fff4" stop-opacity="0.34" />
          <stop offset="1" stop-color="#d9fff4" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="hs-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0b2f30" stop-opacity="0" />
          <stop offset="1" stop-color="#03110f" stop-opacity="0.9" />
        </linearGradient>
        <g id="hs-fish">
          <path d="M-27 0 L-44 -13 Q-39 0 -44 13 Z" fill="#e08a2c" />
          <path d="M-6 -12 Q2 -23 13 -13 Z" fill="#e08a2c" />
          <path d="M-30 0 C-18 -17 10 -19 30 0 C10 19 -18 17 -30 0 Z" fill="#f5b83f" />
          <path d="M-22 5 C-8 12 12 10 25 3 C12 14 -8 14 -22 5 Z" fill="#e08a2c" opacity="0.6" />
          <path
            d="M10 -9 Q14 0 10 9"
            stroke="#0b2b2e"
            stroke-width="2"
            fill="none"
            opacity="0.45"
            stroke-linecap="round"
          />
          <circle cx="19" cy="-3" r="3" fill="#0b2b2e" />
        </g>
      </defs>

      <rect width="1440" height="900" fill="url(#hs-water)" />
      <rect width="1440" height="900" fill="url(#hs-sun)" />

      <g class="rays">
        <path class="ray r1" d="M860 -20 L960 -20 L760 900 L560 900 Z" fill="url(#hs-ray)" />
        <path class="ray r2" d="M1040 -20 L1100 -20 L1010 900 L880 900 Z" fill="url(#hs-ray)" />
        <path class="ray r3" d="M1180 -20 L1300 -20 L1360 900 L1140 900 Z" fill="url(#hs-ray)" />
        <path class="ray r4" d="M640 -20 L690 -20 L420 900 L330 900 Z" fill="url(#hs-ray)" />
      </g>

      <g class="surface" fill="none" stroke="#bff5e6" stroke-linecap="round">
        <path
          d="M0 42 Q120 26 240 42 T480 42 T720 42 T960 42 T1200 42 T1440 42"
          stroke-width="2"
          opacity="0.28"
        />
        <path
          d="M0 70 Q160 56 320 70 T640 70 T960 70 T1280 70 T1600 70"
          stroke-width="1.5"
          opacity="0.16"
        />
      </g>

      <g class="school">
        @for (f of fish; track $index) {
          <g class="lane" [style.animation-duration.s]="f.dur" [style.animation-delay.s]="f.delay">
            <g [attr.transform]="'translate(0 ' + f.y + ') scale(' + f.s + ')'">
              <g class="wiggle" [style.animation-delay.s]="f.delay / 3">
                <use href="#hs-fish" />
              </g>
            </g>
          </g>
        }
      </g>

      <g class="bubbles" fill="none" stroke="#d9fff4" stroke-width="2">
        @for (b of bubbles; track $index) {
          <circle
            class="bubble"
            [attr.cx]="b.x"
            cy="860"
            [attr.r]="b.r"
            [style.animation-delay.s]="b.d"
            [style.animation-duration.s]="b.t"
          />
        }
      </g>

      <rect y="560" width="1440" height="340" fill="url(#hs-floor)" />
      <g class="weeds" fill="none" stroke="#0e5a4d" stroke-width="10" stroke-linecap="round">
        <path class="weed" d="M1210 900 C1200 820 1226 760 1196 690" />
        <path class="weed w2" d="M1250 900 C1262 830 1240 790 1266 720" />
        <path class="weed" d="M1290 900 C1284 850 1300 810 1286 770" />
        <path class="weed w2" d="M90 900 C80 830 104 790 84 730" />
        <path class="weed" d="M130 900 C138 850 124 812 142 776" />
      </g>
      <rect x="1100" y="872" width="96" height="16" rx="8" fill="#021010" opacity="0.9" />
    </svg>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      display: block;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .lane {
      transform: translateX(-160px);
    }
    .ray {
      opacity: 0.8;
      transform-origin: 50% 0;
    }
    .weed {
      transform-origin: 50% 100%;
      transform-box: fill-box;
    }
    .bubble {
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .lane {
        animation: swim linear infinite;
      }
      .wiggle {
        animation: wiggle 1.4s ease-in-out infinite alternate;
        transform-box: fill-box;
        transform-origin: 70% 50%;
      }
      .ray {
        animation: shimmer 9s ease-in-out infinite alternate;
      }
      .r2 {
        animation-delay: -3s;
      }
      .r3 {
        animation-delay: -6s;
      }
      .r4 {
        animation-delay: -4.5s;
      }
      .surface {
        animation: drift 12s linear infinite;
      }
      .weed {
        animation: sway 7s ease-in-out infinite alternate;
      }
      .w2 {
        animation-delay: -3.5s;
      }
      .bubble {
        animation: rise linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      /* A still frame: fish placed across the scene instead of swimming. */
      .lane:nth-child(1) {
        transform: translateX(980px);
      }
      .lane:nth-child(2) {
        transform: translateX(1120px);
      }
      .lane:nth-child(3) {
        transform: translateX(1240px);
      }
      .lane:nth-child(4) {
        transform: translateX(1060px);
      }
      .lane:nth-child(5) {
        transform: translateX(1330px);
      }
      .lane:nth-child(6) {
        transform: translateX(860px);
      }
      .lane:nth-child(7) {
        transform: translateX(1180px);
      }
      .lane:nth-child(8) {
        transform: translateX(760px);
      }
      .bubble {
        opacity: 0.35;
      }
    }
    @keyframes swim {
      from {
        transform: translateX(-160px);
      }
      to {
        transform: translateX(1620px);
      }
    }
    @keyframes wiggle {
      from {
        transform: rotate(-3deg);
      }
      to {
        transform: rotate(3deg);
      }
    }
    @keyframes shimmer {
      from {
        opacity: 0.35;
        transform: skewX(-2deg);
      }
      to {
        opacity: 0.9;
        transform: skewX(3deg);
      }
    }
    @keyframes drift {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-240px);
      }
    }
    @keyframes sway {
      from {
        transform: rotate(-4deg);
      }
      to {
        transform: rotate(5deg);
      }
    }
    @keyframes rise {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(-820px);
        opacity: 0;
      }
    }
  `,
})
export class HeroScene {
  protected readonly fish: SwimmingFish[] = [
    { y: 250, s: 1.25, dur: 34, delay: -4 },
    { y: 330, s: 0.9, dur: 40, delay: -12 },
    { y: 410, s: 1.5, dur: 30, delay: -20 },
    { y: 520, s: 0.75, dur: 46, delay: -2 },
    { y: 300, s: 0.6, dur: 52, delay: -30 },
    { y: 610, s: 1.05, dur: 38, delay: -26 },
    { y: 470, s: 0.55, dur: 58, delay: -44 },
    { y: 200, s: 0.7, dur: 48, delay: -17 },
  ];
  protected readonly bubbles = [
    { x: 1130, r: 6, d: 0, t: 7 },
    { x: 1148, r: 4, d: 1.4, t: 6 },
    { x: 1160, r: 8, d: 2.6, t: 8 },
    { x: 1140, r: 3, d: 3.8, t: 5.5 },
    { x: 1170, r: 5, d: 5, t: 7.5 },
    { x: 1122, r: 4, d: 6.1, t: 6.5 },
  ];
}
