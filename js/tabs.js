const tabsContainerEl = document.querySelector('#tabs');
let tabEls;
let tabContentEls;

/*window.onload = function() {
    hideTabsContent(1);
};*/

const hideTabsContent = (a) => {
    tabEls = tabsContainerEl.querySelectorAll('.vacation-holiday__tab');
    tabContentEls = tabsContainerEl.querySelectorAll('.vacation-holiday__tab-content');
    for (let i = a; i < tabContentEls.length; i++) {
        tabContentEls[i].classList.remove('show');
        tabContentEls[i].classList.add("hide");
        tabEls[i].classList.remove('whiteborder');
    }
};

const showTabsContent = (b) => {
    tabEls = tabsContainerEl.querySelectorAll('.vacation-holiday__tab');
    tabContentEls = tabsContainerEl.querySelectorAll('.vacation-holiday__tab-content');
    if (tabContentEls[b].classList.contains('hide')) {
        hideTabsContent(0);
        tabEls[b].classList.add('whiteborder');
        tabContentEls[b].classList.remove('hide');
        tabContentEls[b].classList.add('show');
    }
};

const onTabsClick = (evt) => {
    const target = evt.target;
    tabEls = tabsContainerEl.querySelectorAll('.vacation-holiday__tab');

    if (target.className === 'vacation-holiday__tab') {
        for (let i = 0; i < tabEls.length; i++) {
            if (target === tabEls[i]) {
                showTabsContent(i);
                break;
            }
        }
    }
};

const setTabsClick = () => {
    tabsContainerEl.addEventListener('click', onTabsClick);
};

export {setTabsClick};
