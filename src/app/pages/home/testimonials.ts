import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Excerpts and attributions from https://www.samakiexpress.co.ke/. */
@Component({
  selector: 'sx-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section testimonials" aria-labelledby="testimonials-title">
      <div class="container">
        <div class="intro">
          <div>
            <p class="eyebrow">From the farming community</p>
            <h2 id="testimonials-title">Growing together.<br /><em>In their words.</em></h2>
          </div>
          <p class="intro-copy">
            Different farms. Shared ambition. Hear from the people growing with Samaki Express.
          </p>
        </div>
        <div class="stories">
          @for (story of stories; track story.name; let i = $index) {
            <figure [class]="'story story--' + i">
              <div class="story-top">
                <span>{{ story.topic }}</span
                ><span class="quote-mark" aria-hidden="true">“</span>
              </div>
              <blockquote>
                <p>“{{ story.quote }}”</p>
              </blockquote>
              <figcaption>
                <span class="avatar" aria-hidden="true">{{ story.initials }}</span>
                <div>
                  <strong>{{ story.name }}</strong
                  ><span>{{ story.role }}</span
                  ><small>{{ story.location }}</small>
                </div>
              </figcaption>
            </figure>
          }
        </div>
        <p class="caption">A few words from our farmers. Excerpts from their testimonials.</p>
      </div>
    </section>
  `,
  styles: `
    .testimonials {
      padding-block: clamp(3.5rem, 7vw, 6rem);
    }
    .intro {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .eyebrow {
      margin-bottom: 1.2rem;
    }
    h2 {
      font-size: clamp(2.4rem, 4.4vw, 4.5rem);
      line-height: 1.05;
      letter-spacing: -0.045em;
      font-weight: 500;
      margin: 0;
    }
    h2 em {
      font-family: var(--font-accent);
      font-weight: 400;
      color: var(--c-brand-text);
    }
    .intro-copy {
      max-width: 29ch;
      color: var(--c-ink-2);
      font-size: 1.05rem;
      line-height: 1.7;
    }
    .stories {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
    }
    .story {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: clamp(1.5rem, 2.5vw, 2.25rem);
      border-radius: 20px;
      min-height: 24rem;
      color: #173f35;
    }
    .story--0 {
      background: #d8ef79;
    }
    .story--1 {
      background: #073d39;
      color: #fffdf3;
    }
    .story--2 {
      background: #f1e5d6;
    }
    .story-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .story-top > span:first-child {
      font: 0.6rem/1.5 var(--font-label);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      padding-top: 0.4rem;
    }
    .quote-mark {
      font: 5rem/0.85 var(--font-accent);
      opacity: 0.65;
    }
    .story--1 .quote-mark {
      color: #d8ef79;
    }
    blockquote {
      margin: 1.2rem 0 2.5rem;
    }
    blockquote p {
      font-size: clamp(1.55rem, 2.2vw, 2.15rem);
      line-height: 1.3;
      letter-spacing: -0.025em;
      text-wrap: pretty;
    }
    figcaption {
      margin-top: auto;
      padding-top: 1.25rem;
      border-top: 1px solid currentColor;
      border-top-color: color-mix(in srgb, currentColor 20%, transparent);
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .avatar {
      display: grid;
      place-items: center;
      flex: 0 0 44px;
      height: 44px;
      border-radius: 14px;
      font-size: 0.8rem;
      background: #ffffff40;
    }
    .story--1 .avatar {
      background: #ffffff15;
      color: #d8ef79;
    }
    figcaption strong {
      display: block;
      font-size: 1rem;
      font-weight: 500;
    }
    figcaption div > span {
      display: block;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
    figcaption small {
      display: block;
      font: 0.6rem var(--font-label);
      margin-top: 0.4rem;
      opacity: 0.75;
    }
    .caption {
      margin-top: 1.25rem;
      font-size: 0.8rem;
      color: var(--c-ink-3);
    }
    @media (max-width: 55rem) {
      .intro {
        align-items: flex-start;
        flex-direction: column;
        gap: 1.25rem;
      }
      .intro-copy {
        max-width: 45ch;
      }
      .stories {
        grid-template-columns: 1fr;
      }
      .story {
        min-height: auto;
        padding: 1.5rem;
      }
      blockquote {
        max-width: 32ch;
        margin-block: 0.75rem 1.75rem;
      }
      blockquote p {
        font-size: 1.8rem;
      }
    }
  `,
})
export class Testimonials {
  protected readonly stories = [
    {
      topic: 'Quality fingerlings',
      quote: 'Their fingerlings are consistently healthy and fast-growing.',
      name: 'Caroline Awino',
      initials: 'CA',
      role: 'Tilapia Farmer',
      location: 'Kiambu',
    },
    {
      topic: 'Delivery & support',
      quote: 'Delivery is always on time',
      name: 'Janeffer Nafula',
      initials: 'JN',
      role: 'Fish Farm Manager',
      location: 'Kisumu',
    },
    {
      topic: 'Practical training',
      quote: 'Their training sessions gave us practical knowledge',
      name: 'Vanessa Musula',
      initials: 'VM',
      role: 'Small-Scale Farmer',
      location: 'Siaya',
    },
  ];
}
