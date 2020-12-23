document.addEventListener('DOMContentLoaded', () => {

  if (CSS.supports('content-visibility', 'auto')) {
    const blocks = document.querySelectorAll('[data-content-visibility]')

    const io = new IntersectionObserver(ioHandlerContentVisibility);

    [].forEach.call(blocks, block => io.observe(block))

  }

  let splits = document.querySelectorAll('[data-animate="split-word"]');

  splits.forEach(split => {
    let splitTextContent = split.textContent;

    split.innerHTML = '';
    split.appendChild(sliptWords(splitTextContent))
  })

  const dataAnimates = document.querySelectorAll("[data-animate]")
  const ioAnimate = new IntersectionObserver(ioHandlerAnimate, ioConfigAnimate);

  [].forEach.call(dataAnimates, dataAnimate => ioAnimate.observe(dataAnimate))
})

const ioHandlerContentVisibility = (entries, self) => {
  for (let entry of entries) {
    if (entry.isIntersecting) {
      entry.target.setAttribute('data-content-visibility', 'true')
      self.unobserve(entry.target)
    }
  }
}

const ioHandlerAnimate = (entries, self) => {
  for (let entry of entries) {
    const target = entry.target
    if (entry.intersectionRatio > .2) {
      target.classList.add(`animate-${target.getAttribute("data-animate")}`)
      self.unobserve(target);
    }
  }
}

const ioConfigAnimate = {
  threshold: .2
}


const elFactory = (type, attributes, ...children) => {
  const el = document.createElement(type)

  for (key in attributes) {
    el.setAttribute(key, attributes[key])
  }

  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child))
    else el.appendChild(child)
  })

  return el
}

const sliptWords = words => {
  const fragment = new DocumentFragment();
  let globalIndex = 0;

  words.split(' ').forEach((word, iWord) => {
    const fragmentLetter = new DocumentFragment();

    word.split('').forEach((letter, iLetter) => {
      globalIndex++;
      const el = elFactory(
        'span',
        {
          'data-letter': `${letter}`,
          class: `letter`,
          style: `--letter-index:${iLetter+1}; --global-index: ${globalIndex};`
        },
        `${letter}`
      )
      fragmentLetter.appendChild(el);
    })

    const space = elFactory(
      'span',
      {
        'data-space': true,
        class: `space`
      },
      ` `
    )
    fragmentLetter.appendChild(space);

    const el = elFactory(
      'span',
      {
        'data-word': `${word}`,
        class: `word`,
        style: `--word-index:${iWord+1}`
      },
      fragmentLetter
    )
    fragment.appendChild(el);
  })

  return fragment;
}
