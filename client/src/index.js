import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import $ from 'jquery';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import { rootReducer } from './redux/rootReducer';
import { checkForBannedWords, checkInputNotEmpty } from './redux/middleware';
import { Timing, NavHeight } from './pwnzVariables';


const store = createStore(rootReducer, compose(
  applyMiddleware(
    thunk,
    checkForBannedWords,
    checkInputNotEmpty
  ),
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

const app = (
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)

ReactDOM.render(
  app,
  document.getElementById('root')
);

$(document).ready(() => {
  window.addEventListener('click', (e) => {
    const target = $(e.target);
    if (target.hasClass('pwnz-dropmenu-button')) {
      if (target.hasClass('onCooldown')) return;
      closeDropmenus();
      toggleDropmenu(target);
    } else if (target.closest('.pwnz-buttonWdropmenu').length === 0) {
      closeDropmenus();
    }
    if (target.hasClass('pwnz-buttonWithToggleMenu-button')) {
      if (target.hasClass('onCooldown')) return;
      if (target.hasClass('pwnz-button-show-hide')) {
        target.siblings('.pwnz-toggleMenu').css('display') === 'none' ? target.text('Hide') : target.text('Show');
      }
      target.addClass('onCooldown');
      target.siblings('.pwnz-toggleMenu').toggle(Timing, () => {
        target.removeClass('onCooldown');
      });
    }
    if (target.hasClass('pwnz-buttonWithToggledDiv-closeButton')) {
      target.closest('.pwnz-toggleMenu').hide(Timing);
    }
    //for toggle menus
    // pwnz button with toggle menu
    //b for button, bd for button div, c for content (menu), cb for cancel button
    if (target.hasClass('pwnz-bwtm-b')) {
      if (target.hasClass('onCooldown')) return;
      target.addClass('onCooldown');
      target.siblings().addClass('onCooldown');
      target.css('display', 'none');
      target.siblings().css('display', 'block')
      target.closest('.pwnz-bwtm-bd').siblings('.pwnz-bwtm-c').toggle(Timing, () => {
        target.removeClass('onCooldown');
        target.siblings().removeClass('onCooldown');
      });
    }
    if (target.hasClass('pwnz-bwtm-cb')) {
      target.closest('.pwnz-bwtm-c').hide(Timing);
      const currentButton = target.closest('.pwnz-bwtm-c').siblings('.pwnz-bwtm-bd').find('.pwnz-bwtm-b:visible')
      currentButton.css('display', 'none');
      currentButton.siblings().css('display', 'block');
    }
    // end of toggle menus
    //for dropdown menus
    if (target.closest('.pwnz-bwdm-bd').length > 0) {
      const newTarget = target.closest('.pwnz-bwdm-bd');
      if (newTarget.hasClass('onCooldown')) return;
      $('.pwnz-bwdm-bd').addClass('onCooldown');
      const menu = newTarget.siblings('.pwnz-bwdm-c');

      if (menu.css('display') === 'none') {
        $('.pwnz-bwdm-c').hide(Timing);
        menu.show(Timing, () => {
          $('.pwnz-bwdm-bd').removeClass('onCooldown');
        })
      } else if (menu.css('display') === 'block') {
        menu.hide(Timing, () => {
          $('.pwnz-bwdm-bd').removeClass('onCooldown');
        })
      }
    }
    if (target.closest('.pwnz-bwdm').length < 1 || target.hasClass('pwnz-bwdm-cb')) {
      $('.pwnz-bwdm-c').hide(Timing);
    }
    //end of dropdown menus
    //scroll top 0
    if (target.hasClass('pwnz-scrollTop0')) {
      $('html,body').animate({
        scrollTop: 0
      }, Timing/2,'swing')
    }
    //end of scroll top 0
  });//end of window click handler

  window.addEventListener('scroll', function(e){
    const topOffset=window.pageYOffset || document.documentElement.scrollTop;
    if (topOffset>NavHeight) {
      $('.pwnz-scrollTopButton').removeClass('pwnz-d-n');
    } else {
      $('.pwnz-scrollTopButton').addClass('pwnz-d-n');
    }
  })
  


})

function toggleDropmenu(target) {
  $('.pwnz-dropmenu-button').addClass('onCooldown');

  if (target.hasClass('pwnz-animated')) {
    let rotation;
    if (target.attr('rotate') === '405') {
      rotation = '405';
    } else if (target.attr('rotate') === '180') {
      rotation = '180';
    } else if (target.attr('rotate') === '360') {
      rotation = '360';
    }
    const dropmenu = target.siblings('.pwnz-dropmenu');
    if (dropmenu.css('display') === 'none') {
      dropmenu.show(Timing);
      if (rotation) {
        target.addClass(`animated-${rotation}-rotation`);
        target.removeClass(`animated-${rotation}-rotation-back`);
      }
    } else if (dropmenu.css('display') === 'block') {
      dropmenu.hide(Timing);
      if (rotation) {
        target.addClass(`animated-${rotation}-rotation-back`);
        target.removeClass(`animated-${rotation}-rotation`);
      }
    }
    target.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
      function (e) {
        $('.pwnz-dropmenu-button').removeClass(`onCooldown`);
      }
    );
  } else {
    const dropmenu = target.siblings('.pwnz-dropmenu');
    if (dropmenu.css('display') === 'none') {
      dropmenu.show(Timing, () => {
        $('.pwnz-dropmenu-button').removeClass('onCooldown');
      });
    } else if (dropmenu.css('display') === 'block') {
      dropmenu.hide(Timing, () => {
        $('.pwnz-dropmenu-button').removeClass('onCooldown');
      });
    }
  }


}

function closeDropmenus() {
  $('.pwnz-dropmenu-button').each(function () {
    if ($(this).siblings('.pwnz-dropmenu').css('display') !== 'none') {
      toggleDropmenu($(this));
    }
  })
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
