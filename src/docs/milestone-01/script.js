const sections = document.querySelectorAll('section.collapsible');
const navLinks = document.querySelectorAll('a');

function toggleCollapsibleSection(section) {
  const title = section.querySelector('h2, h3');
  const sectionContent = section.querySelector('div,p');

  if (!sectionContent) {
    return console.error('No section content found');
  }

  title.classList.toggle('active');
  sectionContent.classList.toggle('collapsible-show');
}

function openCollapsibleSection(section) {
  const title = section.querySelector('h2, h3');
  const sectionContent = section.querySelector('div,p');

  if (!sectionContent) {
    return console.error('No section content found');
  }

  title.classList.add('active');
  sectionContent.classList.add('collapsible-show');
}

sections.forEach((section) => {
  const title = section.querySelector('h2, h3');
  const sectionContent = section.querySelector('div,p');

  const clickHandler = () => {
    toggleCollapsibleSection(section);
  };

  if (title) {
    title.classList.add('collapsible-title');
    title.addEventListener('click', clickHandler);
  } else {
    console.error('Section with missing h2 or h3 title');
  }

  if (sectionContent) {
    sectionContent.classList.add('collapsible-content');
  }
});

navLinks.forEach((navLink) => {
  const navId = navLink.href.split('#')[1];
  const targetElement = document.getElementById(navId);

  navLink.addEventListener('click', () => {
    if (targetElement.classList.contains('collapsible')) {
      openCollapsibleSection(targetElement);
    }
  });
});
