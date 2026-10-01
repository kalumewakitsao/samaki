import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../../ui/icon';
@Component({
  selector: 'sx-about-values',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: ` <section class="section" aria-labelledby="values-title">
    <div class="container">
      <div class="section-head section-head--split">
        <div class="stack">
          <p class="eyebrow">Our values</p>
          <h2 class="h2" id="values-title">
            Good farming starts<br />with <em class="type-accent">good principles.</em>
          </h2>
        </div>
        <p class="lead">
          The things we stand for shape the advice we give, the products we supply and the way we
          work with you.
        </p>
      </div>
      <ol class="values" role="list">
        @for (v of values; track v.title; let i = $index) {
          <li>
            <div class="value-art" aria-hidden="true">
              <span class="number">0{{ i + 1 }}</span
              ><sx-icon [name]="v.icon" /><span class="orbit"></span>
            </div>
            <div class="value-copy">
              <h3>{{ v.title }}</h3>
              <p>{{ v.body }}</p>
            </div>
          </li>
        }
      </ol>
    </div>
  </section>`,
  styles: `
    .values {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1.25rem;
      list-style: none;
      padding: 0;
    }
    .values li {
      overflow: hidden;
      border-radius: 20px;
      background: var(--c-surface);
      border: 1px solid var(--c-line);
    }
    .value-art {
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      height: 160px;
      overflow: hidden;
      background: #e4eccb;
      color: #315443;
    }
    .values li:nth-child(2) .value-art {
      background: #e0deef;
      color: #5b4d7a;
    }
    .values li:nth-child(3) .value-art {
      background: #f1ddc5;
      color: #825331;
    }
    .values li:nth-child(4) .value-art {
      background: #d1e7e0;
      color: #2e6658;
    }
    .value-art sx-icon {
      width: 54px;
      height: 54px;
      transform: rotate(-8deg);
    }
    .number {
      position: absolute;
      top: 1rem;
      left: 1rem;
      font: 0.7rem var(--font-label);
    }
    .orbit {
      position: absolute;
      z-index: -1;
      width: 220px;
      height: 220px;
      border: 1px solid currentColor;
      opacity: 0.16;
      border-radius: 50%;
      top: 35px;
      right: -30px;
    }
    .orbit::after {
      content: '';
      position: absolute;
      inset: 20px;
      border: 1px solid currentColor;
      border-radius: 50%;
    }
    .value-copy {
      padding: 1.5rem;
    }
    h3 {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .value-copy p {
      color: var(--c-ink-2);
      font-size: 1rem;
      line-height: 1.65;
    }
    @media (max-width: 63.99rem) {
      .values {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 35.99rem) {
      .values {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .values li {
        display: grid;
        grid-template-columns: 84px 1fr;
      }
      .value-art {
        height: 100%;
        min-height: 160px;
      }
      .value-art sx-icon {
        width: 36px;
        height: 36px;
      }
      .value-copy {
        padding: 1.25rem;
      }
      h3 {
        font-size: 1.3rem;
      }
    }
  `,
})
export class AboutValues {
  protected readonly values = [
    {
      icon: 'sprout',
      title: 'Sustainability',
      body: 'We favour responsible farming practices that protect water, stock and livelihoods for the long term.',
    },
    {
      icon: 'gauge',
      title: 'Innovation',
      body: 'Practical tools and methods that help farms produce more with less waste.',
    },
    {
      icon: 'people',
      title: 'Community',
      body: 'Farmer-first support, with hands-on training and advice that is easy to reach.',
    },
    {
      icon: 'shield',
      title: 'Integrity',
      body: 'Straight answers on what we can supply, when, and at what price.',
    },
  ];
}
