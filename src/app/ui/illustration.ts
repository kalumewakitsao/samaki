import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { IllustrationId } from '../core/data/catalogue';

interface Fish {
  x: number;
  y: number;
  s: number;
  flip?: boolean;
  d?: number;
}

/**
 * Spot illustrations drawn for Samaki Express (AI-assisted, hand-tuned SVG).
 * They stand in for product photography until real photos exist, and use the
 * illustration tokens so each scene is recoloured for light and dark themes.
 */
@Component({
  selector: 'sx-illustration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'illustration' },
  template: `
    <ng-template #fishTpl let-f>
      <svg:g [attr.transform]="'translate(' + f.x + ' ' + f.y + ') scale(' + (f.flip ? -f.s : f.s) + ' ' + f.s + ')'">
        <svg:g class="swim" [style.animation-delay.s]="f.d ?? 0">
          <svg:path d="M-27 0 L-44 -13 Q-39 0 -44 13 Z" fill="var(--ill-fish-2)" />
          <svg:path d="M-6 -12 Q2 -23 13 -13 Z" fill="var(--ill-fish-2)" />
          <svg:path d="M-30 0 C-18 -17 10 -19 30 0 C10 19 -18 17 -30 0 Z" fill="var(--ill-fish)" />
          <svg:path d="M-22 5 C-8 12 12 10 25 3 C12 14 -8 14 -22 5 Z" fill="var(--ill-fish-2)" opacity="0.55" />
          <svg:path d="M10 -9 Q14 0 10 9" stroke="var(--ill-line)" stroke-width="2" fill="none" opacity="0.45" stroke-linecap="round" />
          <svg:circle cx="19" cy="-3" r="3" fill="var(--ill-line)" />
        </svg:g>
      </svg:g>
    </ng-template>

    <svg [attr.viewBox]="name() === 'hero' ? '0 0 560 520' : '0 0 400 300'" role="img" [attr.aria-label]="label()"
      preserveAspectRatio="xMidYMid slice" focusable="false">
      @switch (name()) {
        @case ('hero') {
          <rect width="560" height="520" fill="var(--ill-water-1)" />
          <circle cx="440" cy="92" r="46" fill="var(--c-accent)" opacity="0.9" />
          <path d="M0 150 Q70 132 140 150 T280 150 T420 150 T560 150 V520 H0 Z" fill="var(--ill-water-2)" />
          <path d="M0 290 Q70 276 140 290 T280 290 T420 290 T560 290 V520 H0 Z" fill="var(--ill-water-3)" opacity="0.55" />
          <path d="M0 420 Q90 404 180 420 T360 420 T560 416 V520 H0 Z" fill="var(--ill-deep)" opacity="0.35" />
          <g stroke="var(--ill-deep)" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8">
            <path d="M52 520 C50 460 60 420 44 360" /><path d="M72 520 C76 470 70 430 86 380" /><path d="M500 520 C498 470 510 440 494 400" /><path d="M520 520 C526 480 520 450 534 420" />
          </g>
          <g class="school">
            @for (f of heroFish; track $index) {
              <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: f }" />
            }
          </g>
          <rect x="250" y="470" width="80" height="18" rx="9" fill="var(--ill-line)" opacity="0.85" />
          <g fill="none" stroke="var(--ill-paper)" stroke-width="2.5" opacity="0.9">
            @for (b of heroBubbles; track $index) {
              <circle class="bubble" [attr.cx]="b.x" [attr.cy]="b.y" [attr.r]="b.r" [style.animation-delay.s]="b.d" />
            }
          </g>
        }
        @case ('fingerlings') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M0 70 Q50 58 100 70 T200 70 T300 70 T400 70 V300 H0 Z" fill="var(--ill-water-2)" />
          <path d="M0 200 Q60 188 120 200 T240 200 T360 200 T400 200 V300 H0 Z" fill="var(--ill-water-3)" opacity="0.5" />
          @for (f of [{ x: 130, y: 130, s: 0.9 }, { x: 225, y: 112, s: 1.15, d: 0.6 }, { x: 290, y: 165, s: 0.8, d: 1.1 }, { x: 175, y: 190, s: 0.7, d: 0.3 }, { x: 95, y: 225, s: 0.6, d: 1.4 }]; track $index) {
            <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: f }" />
          }
          <g stroke="var(--ill-deep)" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7">
            <path d="M340 300 C338 270 346 250 336 222" /><path d="M356 300 C360 276 354 256 366 236" />
          </g>
        }
        @case ('feeds') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect y="236" width="400" height="64" fill="var(--ill-sand)" />
          <path d="M150 112 Q150 92 170 90 L230 90 Q250 92 250 112 L262 240 Q262 254 248 254 L152 254 Q138 254 138 240 Z" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" stroke-linejoin="round" />
          <path d="M162 92 Q200 70 238 92" fill="none" stroke="var(--ill-line)" stroke-width="3" stroke-linecap="round" />
          <circle cx="200" cy="170" r="34" fill="var(--ill-water-2)" />
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 203, y: 170, s: 0.6 } }" />
          <g fill="var(--ill-fish-2)">
            <circle cx="282" cy="248" r="6" /><circle cx="298" cy="240" r="5" /><circle cx="312" cy="252" r="6" /><circle cx="292" cy="258" r="5" /><circle cx="326" cy="244" r="5" /><circle cx="306" cy="228" r="4" /><circle cx="110" cy="250" r="5" /><circle cx="96" cy="242" r="4" />
          </g>
        }
        @case ('hatchery') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <ellipse cx="262" cy="238" rx="96" ry="22" fill="var(--ill-water-2)" stroke="var(--ill-line)" stroke-width="3" />
          <g stroke="var(--ill-line)" stroke-width="2">
            @for (e of eggs; track $index) {
              <circle [attr.cx]="e[0]" [attr.cy]="e[1]" [attr.r]="e[2]" fill="var(--ill-fish)" />
            }
          </g>
          <g fill="var(--ill-line)" opacity="0.7">
            @for (e of eggs; track $index) {
              <circle [attr.cx]="e[0] + 3" [attr.cy]="e[1] - 2" r="2.5" />
            }
          </g>
          <rect x="96" y="70" width="64" height="176" rx="18" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M99 150 H157 V228 Q157 243 142 243 H114 Q99 243 99 228 Z" fill="var(--ill-deep)" opacity="0.85" />
          <rect x="104" y="52" width="48" height="24" rx="6" fill="var(--ill-line)" />
          <path d="M112 110 h32 M112 126 h22" stroke="var(--ill-line)" stroke-width="3" stroke-linecap="round" opacity="0.5" />
        }
        @case ('testing') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M0 212 Q50 202 100 212 T200 212 T300 212 T400 212 V300 H0 Z" fill="var(--ill-water-2)" />
          <path d="M150 196 C 200 196 250 150 300 170 L300 240" fill="none" stroke="var(--ill-line)" stroke-width="4" stroke-linecap="round" />
          <rect x="290" y="236" width="20" height="40" rx="8" fill="var(--ill-line)" />
          <rect x="78" y="56" width="112" height="176" rx="20" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <rect x="94" y="74" width="80" height="62" rx="10" fill="var(--ill-water-2)" />
          <path d="M100 116 Q116 96 132 108 T168 96" fill="none" stroke="var(--ill-deep)" stroke-width="4" stroke-linecap="round" />
          <circle cx="112" cy="168" r="11" fill="var(--ill-fish)" /><circle cx="156" cy="168" r="11" fill="var(--ill-water-3)" />
          <rect x="104" y="196" width="60" height="10" rx="5" fill="var(--ill-line)" opacity="0.3" />
          <g transform="rotate(14 330 90)">
            <rect x="318" y="40" width="26" height="110" rx="13" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
            <path d="M321 100 H341 V137 Q341 147 331 147 Q321 147 321 137 Z" fill="var(--ill-fish)" />
          </g>
        }
        @case ('aeration') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M0 120 Q50 108 100 120 T200 120 T300 120 T400 120 V300 H0 Z" fill="var(--ill-water-2)" />
          <rect x="44" y="40" width="120" height="66" rx="14" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M62 60 h40 M62 76 h60" stroke="var(--ill-line)" stroke-width="3" stroke-linecap="round" opacity="0.5" />
          <circle cx="140" cy="72" r="10" fill="var(--ill-fish)" />
          <path d="M164 74 C 240 74 240 150 240 250" fill="none" stroke="var(--ill-line)" stroke-width="4" stroke-linecap="round" />
          <rect x="206" y="248" width="70" height="16" rx="8" fill="var(--ill-line)" />
          <g fill="none" stroke="var(--ill-paper)" stroke-width="2.5">
            @for (b of aerationBubbles; track $index) {
              <circle class="bubble" [attr.cx]="b.x" [attr.cy]="b.y" [attr.r]="b.r" [style.animation-delay.s]="b.d" />
            }
          </g>
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 330, y: 190, s: 0.8, flip: true } }" />
        }
        @case ('filtration') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect x="56" y="62" width="288" height="190" rx="18" fill="var(--ill-water-2)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M59 100 H341" stroke="var(--ill-paper)" stroke-width="3" opacity="0.7" />
          <rect x="262" y="96" width="52" height="124" rx="10" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <g stroke="var(--ill-line)" stroke-width="2.5" opacity="0.5"><path d="M272 124 h32 M272 140 h32 M272 156 h32 M272 172 h32 M272 188 h32" /></g>
          <g fill="none" stroke="var(--ill-deep)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M240 210 C 190 236 120 226 100 190" /><path d="M94 200 L100 188 L112 194" />
            <path d="M110 136 C 150 110 210 114 246 132" /><path d="M236 124 L248 133 L238 144" />
          </g>
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 170, y: 172, s: 0.7 } }" />
        }
        @case ('kit') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect y="232" width="400" height="68" fill="var(--ill-sand)" />
          <rect x="70" y="170" width="190" height="70" rx="10" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          @for (t of kitTubes; track $index) {
            <rect [attr.x]="t.x" y="70" width="30" height="130" rx="15" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
            <path [attr.d]="'M' + (t.x + 3) + ' ' + t.level + ' H' + (t.x + 27) + ' V185 Q' + (t.x + 27) + ' 197 ' + (t.x + 15) + ' 197 Q' + (t.x + 3) + ' 197 ' + (t.x + 3) + ' 185 Z'" [attr.fill]="t.fill" />
          }
          <rect x="280" y="96" width="70" height="120" rx="10" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <g><rect x="294" y="112" width="42" height="16" rx="4" fill="var(--ill-water-2)" /><rect x="294" y="136" width="42" height="16" rx="4" fill="var(--ill-water-3)" /><rect x="294" y="160" width="42" height="16" rx="4" fill="var(--ill-fish)" /><rect x="294" y="184" width="42" height="16" rx="4" fill="var(--ill-fish-2)" /></g>
        }
        @case ('pen') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M130 120 H270 V250 Q270 266 254 266 H146 Q130 266 130 250 Z" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M133 170 Q166 160 200 170 T267 170 V250 Q267 263 254 263 H146 Q133 263 133 250 Z" fill="var(--ill-water-2)" />
          <g transform="rotate(-18 214 120)">
            <rect x="196" y="20" width="40" height="200" rx="20" fill="var(--ill-deep)" stroke="var(--ill-line)" stroke-width="3" />
            <rect x="204" y="44" width="24" height="54" rx="6" fill="var(--ill-water-1)" />
            <path d="M208 76 l6 -12 l6 16 l6 -10" fill="none" stroke="var(--ill-line)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="216" cy="118" r="7" fill="var(--ill-fish)" />
          </g>
          <g fill="var(--ill-paper)" opacity="0.8"><circle cx="176" cy="210" r="5" /><circle cx="190" cy="232" r="3.5" /></g>
        }
        @case ('pump') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M0 90 Q50 80 100 90 T200 90 T300 90 T400 90 V300 H0 Z" fill="var(--ill-water-2)" />
          <rect y="262" width="400" height="38" fill="var(--ill-sand)" />
          <rect x="140" y="170" width="96" height="92" rx="20" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M150 238 h76 M150 250 h76" stroke="var(--ill-line)" stroke-width="3" stroke-linecap="round" opacity="0.4" />
          <circle cx="188" cy="204" r="16" fill="var(--ill-deep)" />
          <path d="M236 196 H270 C 300 196 300 150 300 40" fill="none" stroke="var(--ill-line)" stroke-width="12" stroke-linecap="round" />
          <path d="M236 196 H270 C 300 196 300 150 300 40" fill="none" stroke="var(--ill-fish)" stroke-width="6" stroke-linecap="round" />
          <g fill="none" stroke="var(--ill-deep)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M86 150 h36 M110 140 l12 10 -12 10" /><path d="M86 190 h36 M110 180 l12 10 -12 10" /></g>
        }
        @case ('artemia') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <ellipse cx="150" cy="238" rx="84" ry="18" fill="var(--ill-line)" opacity="0.15" />
          <rect x="72" y="96" width="156" height="142" rx="16" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <rect x="64" y="80" width="172" height="28" rx="10" fill="var(--ill-deep)" stroke="var(--ill-line)" stroke-width="3" />
          <rect x="96" y="140" width="108" height="56" rx="10" fill="var(--ill-water-2)" />
          <g fill="var(--ill-fish-2)"><circle cx="126" cy="168" r="6" /><circle cx="148" cy="160" r="6" /><circle cx="170" cy="172" r="6" /><circle cx="140" cy="182" r="5" /><circle cx="162" cy="152" r="4" /></g>
          @for (n of nauplii; track $index) {
            <g [attr.transform]="'translate(' + n.x + ' ' + n.y + ') rotate(' + n.r + ')'">
              <g class="swim" [style.animation-delay.s]="n.d">
                <ellipse cx="0" cy="0" rx="9" ry="6" fill="var(--ill-fish)" />
                <path d="M-8 0 Q-18 -6 -24 0 M-6 3 Q-14 10 -20 8 M-6 -3 Q-14 -10 -20 -8" fill="none" stroke="var(--ill-fish-2)" stroke-width="2.5" stroke-linecap="round" />
                <circle cx="4" cy="-1" r="2" fill="var(--ill-line)" />
              </g>
            </g>
          }
        }
        @case ('support') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M0 190 Q100 140 200 180 T400 160 V300 H0 Z" fill="var(--ill-sand)" />
          <ellipse cx="220" cy="236" rx="120" ry="30" fill="var(--ill-water-3)" opacity="0.8" />
          <path d="M150 232 Q185 222 220 232 T290 232" stroke="var(--ill-paper)" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8" />
          <path d="M64 196 L100 168 L136 196 V236 H64 Z" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" stroke-linejoin="round" />
          <rect x="90" y="208" width="20" height="28" fill="var(--ill-line)" opacity="0.7" />
          <path d="M280 40 C 250 40 232 62 232 86 C 232 122 280 160 280 160 C 280 160 328 122 328 86 C 328 62 310 40 280 40 Z" fill="var(--ill-deep)" />
          <circle cx="280" cy="86" r="17" fill="var(--ill-paper)" />
        }
        @case ('training') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect x="96" y="36" width="208" height="130" rx="14" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M122 140 L166 108 L204 124 L270 70" fill="none" stroke="var(--ill-deep)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="270" cy="70" r="8" fill="var(--ill-fish)" />
          <g fill="var(--ill-water-3)">
            <circle cx="120" cy="214" r="22" /><path d="M78 300 Q80 246 120 244 Q160 246 162 300 Z" />
            <circle cx="280" cy="214" r="22" /><path d="M238 300 Q240 246 280 244 Q320 246 322 300 Z" />
          </g>
          <g fill="var(--ill-fish)">
            <circle cx="200" cy="222" r="24" /><path d="M154 300 Q156 252 200 250 Q244 252 246 300 Z" />
          </g>
        }
        @case ('delivery') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect y="226" width="400" height="74" fill="var(--ill-sand)" />
          <path d="M0 262 H400" stroke="var(--ill-paper)" stroke-width="4" stroke-dasharray="22 18" />
          <g stroke="var(--ill-line)" stroke-width="3" stroke-linejoin="round">
            <rect x="96" y="104" width="160" height="110" rx="10" fill="var(--ill-paper)" />
            <path d="M256 138 H306 L336 172 V214 H256 Z" fill="var(--ill-deep)" />
          </g>
          <path d="M270 148 H300 L318 170 H270 Z" fill="var(--ill-water-1)" opacity="0.9" />
          <g fill="var(--ill-line)"><circle cx="140" cy="222" r="20" /><circle cx="300" cy="222" r="20" /></g>
          <g fill="var(--ill-paper)"><circle cx="140" cy="222" r="7" /><circle cx="300" cy="222" r="7" /></g>
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 178, y: 158, s: 0.85 } }" />
          <g stroke="var(--ill-line)" stroke-width="3.5" stroke-linecap="round" opacity="0.45"><path d="M40 130 h36 M24 158 h50 M44 186 h30" /></g>
        }
        @case ('health') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M200 38 L290 72 V140 C290 196 250 238 200 258 C150 238 110 196 110 140 V72 Z" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" stroke-linejoin="round" />
          <path d="M160 146 L190 176 L244 118" fill="none" stroke="var(--ill-deep)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 318, y: 226, s: 0.8, flip: true } }" />
          <ng-container [ngTemplateOutlet]="fishTpl" [ngTemplateOutletContext]="{ $implicit: { x: 76, y: 208, s: 0.6, d: 0.8 } }" />
        }
        @case ('audit') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <rect x="112" y="46" width="176" height="224" rx="16" fill="var(--ill-paper)" stroke="var(--ill-line)" stroke-width="3" />
          <rect x="164" y="32" width="72" height="30" rx="8" fill="var(--ill-line)" />
          <g fill="var(--ill-water-3)"><rect x="140" y="178" width="26" height="62" rx="5" /><rect x="178" y="152" width="26" height="88" rx="5" /></g>
          <rect x="216" y="116" width="26" height="124" rx="5" fill="var(--ill-deep)" />
          <path d="M140 96 h80 M140 116 h52" stroke="var(--ill-line)" stroke-width="4" stroke-linecap="round" opacity="0.45" />
          <path d="M316 270 V214" stroke="var(--ill-deep)" stroke-width="4" stroke-linecap="round" />
          <path d="M316 222 C 316 196 336 184 360 184 C 360 208 342 222 316 222 Z" fill="var(--ill-water-3)" />
        }
        @case ('water') {
          <rect width="400" height="300" fill="var(--ill-water-1)" />
          <path d="M200 30 C 200 30 280 118 280 172 A 80 80 0 0 1 120 172 C 120 118 200 30 200 30 Z" fill="var(--ill-water-3)" stroke="var(--ill-line)" stroke-width="3" />
          <path d="M126 186 Q160 170 200 186 T274 186 A 76 76 0 0 1 126 186 Z" fill="var(--ill-deep)" opacity="0.8" />
          <path d="M160 150 A 42 42 0 0 1 170 118" stroke="var(--ill-paper)" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.8" />
          <g fill="var(--ill-fish-2)"><circle cx="70" cy="240" r="6" /><circle cx="86" cy="226" r="4" /><circle cx="330" cy="236" r="6" /></g>
        }
      }
    </svg>
  `,
  styles: `
    :host { display: block; overflow: hidden; background: var(--ill-water-1); }
    svg { width: 100%; height: 100%; }
    @media (prefers-reduced-motion: no-preference) {
      .swim { animation: swim 5s var(--ease-in-out) infinite alternate; transform-box: fill-box; }
      .bubble { animation: rise 7s linear infinite; transform-box: fill-box; }
    }
    @keyframes swim { from { transform: translate(-4px, 2px); } to { transform: translate(6px, -3px); } }
    @keyframes rise {
      0% { transform: translateY(0); opacity: 0; }
      15% { opacity: 0.9; }
      100% { transform: translateY(-260px); opacity: 0; }
    }
  `,
  imports: [NgTemplateOutlet],
})
export class Illustration {
  readonly name = input.required<IllustrationId | 'hero'>();
  readonly label = input<string>('');

  protected readonly heroFish: Fish[] = [
    { x: 170, y: 230, s: 1.3 },
    { x: 290, y: 196, s: 1.6, d: 0.7 },
    { x: 400, y: 262, s: 1.1, d: 1.3 },
    { x: 230, y: 330, s: 1.0, d: 0.4 },
    { x: 360, y: 360, s: 1.25, d: 1.8 },
    { x: 120, y: 380, s: 0.8, d: 1.0 },
  ];
  protected readonly heroBubbles = [
    { x: 272, y: 460, r: 6, d: 0 },
    { x: 290, y: 440, r: 4, d: 1.4 },
    { x: 306, y: 456, r: 7, d: 2.6 },
    { x: 284, y: 470, r: 5, d: 3.8 },
    { x: 300, y: 430, r: 3.5, d: 5 },
  ];
  protected readonly aerationBubbles = [
    { x: 226, y: 240, r: 5, d: 0 },
    { x: 244, y: 232, r: 7, d: 1.2 },
    { x: 260, y: 242, r: 4, d: 2.4 },
    { x: 236, y: 244, r: 3.5, d: 3.3 },
    { x: 252, y: 236, r: 5.5, d: 4.4 },
  ];
  protected readonly kitTubes = [
    { x: 88, level: 120, fill: 'var(--ill-water-3)' },
    { x: 150, level: 100, fill: 'var(--ill-fish)' },
    { x: 212, level: 130, fill: 'var(--ill-fish-2)' },
  ];
  protected readonly nauplii = [
    { x: 290, y: 110, r: -10, d: 0 },
    { x: 330, y: 170, r: 15, d: 0.8 },
    { x: 270, y: 200, r: -25, d: 1.6 },
    { x: 340, y: 240, r: 5, d: 2.2 },
  ];
  protected readonly eggs: [number, number, number][] = [
    [222, 222, 12], [248, 214, 13], [276, 222, 12], [302, 216, 11], [236, 236, 11], [264, 238, 12], [292, 236, 11], [318, 230, 10], [210, 238, 9], [250, 196, 10], [282, 200, 10],
  ];
}

