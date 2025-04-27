(window || {}); (function (w) {
  var _self = {
    options: {
      debug: location.protocol == 'file:' || location.hostname == 'localhost' || false,
      leftAlightment: true,
      menuPruning: false,
      menuVerifyConfirmedCount: 2
    },
    props: {
      helpVersion: '4.0.2',
      logPrefix: 'TOPNAV:::',
      isIframe: window.self !== window.top,
      content: {
        title: null,
        subtitle: null,
        version: null
      },
      urlContent: {
        index: document.location.href.toLowerCase().indexOf('content')
      }
    },
    log: function () {
      if (!_self.options.debug) return;
      var args = Array.prototype.slice.call(arguments);
      args.unshift(_self.props.logPrefix);
      console.log.apply(console, args);
    },
    version: function () {
      debug('version::', _self.props.helpVersion);
    },
    init: function () {
      debug('Calling load...');
      _self.load();
      debug('Calling ready...');
      _self.ready();
    },
    load: function () {

    },
    ready: function () {
      $(document).ready(function () {

        // Moving elements around page when ready
        $('.cc-inner #auto').insertAfter('.nav-search-wrapper');
        $('.mobile-header').appendTo('nav.title-bar.tab-bar');
        $('.cc-inner .topic-header-bar').insertAfter('.mobile-header');
        $('.cc-home #auto').insertAfter('.nav-search-wrapper');
        $('.cc-portal #auto').appendTo('.portal-hero');
        $('<span class="hamburger-icon"></span>').appendTo('nav.title-bar');
        var prodmenulength = $('#all-prod').length;
        if ((prodmenulength) > 0) {
          var productMenuLink = $("#product-menu-link").text();
          console.log("Loading main product menu from " + productMenuLink + "...");
          $('#all-prod').load(productMenuLink);
        }
        var japrodmenulength = $('#all-prod-ja').length;
        if ((japrodmenulength) > 0) {
          console.log("Loading main product menu (JA)...");
          $('#all-prod-ja').load('/product-menu-ja.html');
        }
        /* Start thumbnails */
        $('.imgEnlarge').each(function () {
          $(this).parents('p').addClass('enlarge-container');
        });

        $('.imgEnlargeNarrowImage').each(function () {
          $(this).parents('p').addClass('enlarge-container');
        });

        /* Tabs */
        if ($('.tabs').length > 0) {
          _self.methods.setTabs();
      }

        /* What's new toggle */
        _self.methods.setWhatsNewToggle();

        // Start youtube videos
        var $videos = $('.videoWrapper');
        var videoExists = $videos.length > 0;
        if (videoExists) {
          _self.methods.handleYoutubeVideos();
        }

        _self.methods.handleCodeWithLineNumbers();
        
        (function() {
          function initWistia() {
            var $wistiaElements = $('.wistia_thumb_wrapper, .wistia_wrapper');
            
            if ($wistiaElements.length === 0) {
              return;
            }
        
            $wistiaElements.each(function(){
              var $wistiaId = $(this).children('.wistia_id');
              var $wistEmbed = $(this).children('.wistia_embed');
              
              if ($wistiaId.length === 0 || $wistEmbed.length === 0) {
                console.warn('Incomplete Wistia element found. Skipping.');
                return;
              }
        
              var wistVid = $wistiaId.text();
              var isThumbWrapper = $(this).hasClass('wistia_thumb_wrapper');
              
              $wistEmbed
                .addClass('wistia_async_' + wistVid)
                .css('max-width', '100%');
              
              if (isThumbWrapper) {
                $wistEmbed
                  .addClass('popover=true popoverSize=620x340')
                  .css('height', '72px')
                  .css('width', '140px');
              } else {
                $wistEmbed
                  .css('height', '349px')
                  .css('width', '620px');
              }
            });
            console.log('Wistia videos initialized');
          }
        
          function loadWistiaScript() {
            var script = document.createElement('script');
            script.src = 'https://fast.wistia.com/assets/external/E-v1.js';
            script.async = true;
            script.onload = initWistia;
            script.onerror = function() {
              console.error('Failed to load Wistia script');
            };
            document.body.appendChild(script);
          }
        
          function checkSideNavAndLoadWistia(retryCount = 0) {
            const maxRetries = 50;
            if ($('.sidenav-container a.selected').length > 0) {
              console.log('Side navigation has loaded, now loading Wistia'); 
              loadWistiaScript();
            } else if (retryCount < maxRetries) {
              setTimeout(() => checkSideNavAndLoadWistia(retryCount + 1), 100);
            } else {
              console.log('Proceeding to load Wistia after timeout');
              loadWistiaScript();
            }
           }
        
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkSideNavAndLoadWistia);
          } else {
            checkSideNavAndLoadWistia();
          }
        })();

        $('a').each(function () {
          var href = $(this).attr('href');
          if (href && href.indexOf('//') > -1) {
            if (!$(this).attr('target')) {
              $(this).attr('target', '_blank');
            }
          }
        });

        // Wistia icon video event
        //   $('.wistia-icon-container .video-icon').on(_self.utils.clickEventType(), function (e) {
        //     e.preventDefault;
        //     $(this).next().css('display','flex');
        //     });

        // Download link style event
        $('a.downloadFile').each(function () {
          $(this).attr("download", "");
          $(this).attr("target", "_blank");
        });

        // Table admon tooltips 

        $('<span class="tooltip-container" title="Caution"></span>').prependTo('table div.caution');
        $('<span class="tooltip-container" title="Warning"></span>').prependTo('table div.warning')
        $('<span class="tooltip-container" title="Tip"></span>').prependTo('table div.tip')
        $('<span class="tooltip-container" title="Code"></span>').prependTo('table div.code')
        $('<span class="tooltip-container" title="Note"></span>').prependTo('table div.note')
        $('<span class="tooltip-container" title="Example"></span>').prependTo('table div.example')
        $('<span class="tooltip-container" title="Important"></span>').prependTo('table div.important')

        // Hiding breadcrumbs
        $('.breadcrumbs').css('visibility', 'hidden');

        // Search placeholder for 404 page
        $('.content-404 .search-field.needs-pie').attr('placeholder', 'Search using keywords');

        // $('.cc-home .content-404 .rg-search').css('visibility','visible!important');

        // Update responsive menu
        $('.menu.off-canvas-list').on('loaded', function (selector) {
          $('.hamburger-icon').on('click', function (e) {
            $('.cc-main-menu.product').toggleClass('mobile');
            $(this).toggleClass('close-icon');
          });
          $('.cc-main-menu.version-control > ul > li.has-sub-menu').on('click', function (e) {
            $('.cc-main-menu.version-control').toggleClass('version-mobile');
          });
          $(this).prepend("<div class='responsive-menu-header'><span>Table of Contents</span><button class='menu-icon responsive-close' title='Close'><span></span></button></div>");
          $('.menu-icon.responsive-close').on(_self.utils.clickEventType(), function (e) {
            e.preventDefault();
            $('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open is-open-left');
            $('.off-canvas.position-left').removeClass('is-open').attr('aria-hidden', 'true');
            $('.js-off-canvas-exit').removeClass('is-visible');
          });
          // $(".js-drilldown-back:not(:first)").remove();
          // $(selector).prepend('<div class="responsive-menu-header"><div class="responsive-menu-header-row"><span class="responsive-menu-header-title">' + /*_self.utils.getVar('#var-header-title') +*/ '</span><button class="menu-icon responsive-close" title="Search"><span></span></button></div>'
          // /*this line was already disabled:*/
          // // <div class="responsive-menu-header-row">' + $('.version-control')[0].outerHTML + '</div>
          // + '</div>');
          // if (isTheme('Secretless'))
          //   $('.responsive-menu-header-title').html($('.title-bar-layout a.logo')[0].outerHTML);
          // $('.responsive-menu-header .version-control').click(function () {
          //   $(this).toggleClass('active');
          // });

          // $(selector + 'a').on(_self.utils.clickEventType(), function () {
          //   _self.methods.addResponsiveMenuHeader($(this));
          // });
        });



        // When hidden top menu loads
        // $('ul.navigation').on('loaded', function (selector) {
        //   $(selector + '>li>a').each(function (index) {
        //     var $this = $(this);
        //     $this.on('mouseenter', function () {

        //       var iv = setInterval(function () {
        //         var href = $('+.sub-menu>li:first-child>a', $this).attr('href');
        //         if (!href) return;
        //         clearInterval(iv);

        //         // Set category link to open first submenu item
        //         $this.attr('href', href);
        //         $('+.sub-menu', $this).remove();
        //       }, 200);
        //     });
        //     $this.trigger('mouseenter').off('mouseenter');
        //   });
        // });

        // When sidenav loads
        $('ul.sidenav').on('loaded', function (selector) {
          console.log('The side navigation menu has loaded.')
          //Add title suffix to inner pages
          if (document.querySelector('.cc-inner') !== null) {
            $('title').append(' | CyberArk Docs');
          }
          $("#sidenav-toggle-closed").prependTo('.sidenav-container');
          $("#sidenav-toggle-open").prependTo('.sidenav-container');
          $("#sidenav-toggle-closed").css('visibility', 'visible');
          $("#sidenav-toggle-open").css('visibility', 'visible');
          $("#itn-toggle-closed").prependTo('.cc-headings-menu');
          $("#itn-toggle-open").prependTo('.cc-headings-menu');
          $("#itn-toggle-closed").css('visibility', 'visible');
          $("#itn-toggle-open").css('visibility', 'visible');
          // Handle sidenav toggle clicks
          $("#sidenav-toggle-closed").click(function () {
            $(this).hide();
            $('#sidenav-toggle-open').show();
            $('.sidenav-container').removeClass('closed');
            $('div.content').removeClass('sidenav-closed');
            $('.sidenav-container ul.sidenav').removeClass('closed');
          })
          $("#sidenav-toggle-open").click(function () {
            $(this).hide();
            $('#sidenav-toggle-closed').show();
            $('.sidenav-container').addClass('closed');
            $('div.content').addClass('sidenav-closed');
            $('.sidenav-container ul.sidenav').addClass('closed');
          })
          $("#itn-toggle-closed").click(function () {
            $(this).hide();
            $('#itn-toggle-open').show();
            $('.cc-headings-menu').removeClass('closed');
            $('.col2-content').removeClass('itn-closed');
            $('.cc-headings-menu > ul').removeClass('closed');
          })
          $("#itn-toggle-open").click(function () {
            $(this).hide();
            $('#itn-toggle-closed').show();
            $('.cc-headings-menu').addClass('closed');
            $('.col2-content').addClass('itn-closed');
            $('.cc-headings-menu > ul').addClass('closed');
          })
          // Toggler
          $('div.Toggler').each(function () {
            $('.dropDownHead > a').click(function () {
              var notClicked = $('.dropDownHead > a').not(this);
              $(notClicked).each(function () {
                var parentD = $(this).parents('.dropDown');
                parentD.removeClass('MCDropDown_Open');
                parentD.addClass('MCDropDown_Closed')
                parentD.attr('data-mc-state', 'closed');
              });
              $([document.documentElement, document.body]).animate({
                scrollTop: $(this).offset().top - 160
              }, 100);
            });
          });
          // Update breadcrumbs
          _self.utils.execIf({
            selector: '.breadcrumbs',
            delay: 100,
            maxAttempts: 50,
            verify: true,
            callback: function (selector) {
              var topicSel = $(".MCBreadcrumbsSelf").first().text();

              // $('ul.navigation a:contains(' + topicSel + ')')
              //   .parent()
              //   .addClass('selected');
              $('#breadcrumb-home').prependTo('.MCBreadcrumbsPrefix');
              // Add arrow before home
              if ($('.MCBreadcrumbsDivider').length) {
                $('.MCBreadcrumbsDivider').first().clone().insertAfter('.MCBreadcrumbsPrefix');
                $('.breadcrumbs').css('visibility', 'visible');
              }
              else
                $('<span class="MCBreadcrumbsDivider"> &gt; </span>').insertAfter('.MCBreadcrumbsPrefix');
              $('.breadcrumbs').css('visibility', 'visible');

              // Set home breadcrumb link
              if (isTheme('Conjur'))
                var homePageHref = 'https://docs.conjur.org/';
              else
                var homePageHref = $('.title-bar-layout a.logo').attr('href');

              // Set logo link after breadcrumb link is set
              if (isTheme('Default'))
                var logoLink = $("#portal-link").text();
              $('.title-bar-layout a.logo').attr('href', logoLink); // set logo url only after setting home breacrumb url
              $('.MCBreadcrumbsPrefix').wrap('<a href="' + homePageHref + '" />');

              // Add tooltip if breadcrumb width too long
              $('.breadcrumbs')
                .each(function () {
                  if (this.offsetWidth < this.scrollWidth)
                    $('.MCBreadcrumbsLink,.MCBreadcrumbsSelf')
                      .each(function () {
                        var $this = $(this);
                        $this.attr('title', $this.text());
                      });
                });
            }
          });
          if ($('#fs-on').length) {
            $('.cc-inner .nav-search-wrapper').addClass('fs-on');
          }
          // Highlight selected category
          var $menu = $('.sidenav');
          var menuTop = $menu[0].getBoundingClientRect().top;
          var viewBottom = $(window).scrollTop() + $(window).height();
          $menu.css({
            'max-height': (viewBottom - menuTop) + 'px',
            'visibility': 'visible'
          });
          var $gfmenu = $('._Skins_cc_GuidedFlowsMenu');
          if ($gfmenu.length > 0) {  // Check if element exists
              var menuTop = $gfmenu[0].getBoundingClientRect().top;
              var viewBottom = $(window).scrollTop() + $(window).height();
              $gfmenu.css({
                  'max-height': (viewBottom - menuTop) + 'px',
                  'visibility': 'visible'
              });
          }
          // Add tooltip for side menu items with ellipsis
          $('.sidenav-container .sidenav a')
            .on('mouseenter', function () {
              var $this = $(this);
              $this.off('mouseenter');
              if (this.offsetWidth < this.scrollWidth && !$this.attr('title'))
                $this.attr('title', $this.text());
            });
          //   $('a[href^="#"]').on('click',function(e) {
          //     e.preventDefault();
          //     var offset = 0;
          //     var target = this.hash;
          //     if ($(this).data('offset') != undefined) offset = $(this).data('offset');
          //     $('html, body').stop().animate({
          //       'scrollTop': $(target).offset().top - offset}, 500, 'swing', function() {
          //     window.location.hash = target;
          //     });
          //   });

          //   if(window.location.hash) {
          //     var offsetPage = 110;
          //     $('html, body').animate({
          //         scrollTop: $(window.location.hash).offset().top - offsetPage
          //     }, 0);
          // }
          // Header offset
          // $(":header").each(function() {
          //   var headingID = this.id;
          //   $(this).removeAttr('id');
          //   $(this).prepend("<a class=anchorOffset id= " + headingID + "/>");
          //   });   

          /* Handle sticky menu and ffedback bar events */
          $(w).on('resize', function () {
            _self.methods.handleStickyMenu();

            if ($(window).width() > 1023) {
              $('.menu-icon.responsive-close').click();
              $('.cc-main-menu').removeClass('mobile');
              $('.hamburger-icon').removeClass('close-icon');
            }
            // _self.methods.positionFooter();
          });
          $('.body-container').on('scroll', function () {
            _self.methods.handleStickyMenu();

            _self.methods.updateHeadingsMenu();
          });

          // Show page after above is complete
          $('.cc-inner').addClass('loaded');
          $('.main-section').css('visibility', 'visible');
          $('.cc-inner .wistia_embed').css('opacity', '1');
          $('.rg-footer').css('visibility', 'visible');

        });

        // Fix Headings Menu
        $('.sidenav').on('loaded', function () {

          /* Update toolbar prev and next button tooltips*/
          var btn = $('.previous-topic-button');
          btn.html('<span>' + btn.attr('title') + '</span>');
          btn = $('.next-topic-button');
          btn.html('<span>' + btn.attr('title') + '</span>');
          if ($('.share-button').length) {
          $('#share-dropdown').appendTo('.share-button');
          }

          /* Hide menu if only topic heading */
          var menu = $('.col2-right .cc-headings-menu .menu')[0];
          var menuDescendants = $(menu).find('li').length;
          if (menuDescendants < 2 || menu.offsetHeight < 40) {
            // old:           if (menu.children.length < 2 || menu.offsetHeight < 65) {
            menu.style.display = 'none';
            return;
          }

          /* Add in this topic menu heading */
          var inthistopictext = $('#inthistopic').text();
          $('<p>' + inthistopictext + '</p>').prependTo(menu);
          /* Create inline in this topic menu to content for mobile */
          $('<div class="cc-inline-headings-menu"></div>')
            .append(menu.cloneNode(true))
            .insertAfter('.col2-content h1');

          /* Handle selected menu items */
          _self.methods.updateHeadingsMenu();

          /* Fix bookmarks + add tooltips */
          // $('a', selector)
          //   .each(function () {
          //     var id = this.outerHTML.match(/href="#(.*?)"/)[1];
          //     if ($('[data-id="' + id + '"]').length) {
          //       var newId = $('[data-id="' + id + '"]').attr('id');
          //       this.href = '#' + newId;
          //     }
          //   })
          //   .on('mouseenter', function () {
          //     var $this = $(this);
          //     $this.off('mouseenter');
          //     if (this.offsetWidth < this.scrollWidth && !$this.attr('title'))
          //       $this.attr('title', $this.text());
          //   });
          /* Back to top */
          // $('<a onclick="$(\'html,body\').animate({scrollTop:0},400);history.pushState(\'\',document.title,window.location.pathname+window.location.search);return false;" class="BackToTop"><span>Back to top</span></a>').appendTo(menu);
        });
      });
      $(function () {
        _self.methods.setTheme();
        _self.props.content.title = _self.utils.getVar('#var-header-title');
        _self.props.content.subtitle = _self.utils.getVar('#var-header-subtitle');
        _self.props.content.version = _self.utils.getVar('#var-version');
        _self.props.content.reviewlabel = _self.utils.getVar('#var-review-label');
        _self.props.urlContent.base = document.location.href.substring(0, _self.props.urlContent.index);
        _self.props.urlContent.parts = _self.props.urlContent.base.split('/');
        if (_self.options.leftAlightment) $('body').addClass('cc-left-align');

        var versionPrefix = 'Version ';
        if (isTheme('Conjur') || isTheme('Secretless')) versionPrefix = '';

        // Add sub menu class for main menu
        $('.cc-main-menu>ul>li>ul').parent().addClass('has-sub-menu');
        $('.cc-main-menu>ul>li>ul>li>ul').parent().addClass('has-sub-menu');

        // Fix logo images for themes
        $('.title-bar-layout a.logo')
          .css('background-image', 'url("' + $('#theme-logo>img').attr('src') + '")');
        if (isTheme('Secretless')) $('.title-bar-layout a.logo').attr('href', 'https://secretless.io/');
        if (isTheme('Conjur')) $('.title-bar-layout a.logo').attr('href', 'https://conjur.org/');

        // Add header title and subtitles for default theme
        if (isTheme('Default')) {
          var html = '<span class="header-title">' + _self.props.content.title + '</span>';
          if (_self.props.content.subtitle.length > 2)
            html += '<span class="header-subtitle">' + _self.props.content.subtitle + '</span>';
          // // Select home page toggle if matches  subtitle
          // $('.rg-toggle .rg-toggle-wrapper>ul>li>a').each(function( ){
          //   var toggleText = $(this).text();
          //     if (toggleText === _self.props.content.subtitle) {
          //       $(this).addClass('selected');	
          //   }
          //     else {
          //       $(this).removeClass('selected');
          //   }
          // });
          // Add header title and subtitle version area after logo 
          $('.rg-version')
            .html(html)
            .insertAfter($('.tab-bar .logo'));
          if (_self.props.content.reviewlabel.length > 2) {
            var revlabel = '<span class="review-label">' + _self.props.content.reviewlabel + '</span>';
            $(revlabel).appendTo($('.logo-wrapper'));
          }

        }
        _self.utils.fixStringRepeat();
        _self.methods.generateVersionMenu();

        var maxWidth = $('.title-bar-section').css('max-width');
        if (!isTheme('Secretless')) $('.navigation-wrapper').appendTo('.title-bar');
        // Add footer
        $('.rg-footer').appendTo('.body-container');

        // Make footer visible on inner pages
        if (!$('.cc-inner').length) $('.rg-footer').css('visibility', 'visible');
        // $('ul.navigation').css({
        //   'max-width': maxWidth,
        //   'width': '100%'
        // });
        $('.footer-wrapper').css('max-width', maxWidth);
        if ($('.cc-inner.no-menu').length) {
          // Display page if no menu
          $('.cc-inner').addClass('loaded');
          $('.main-section').css('visibility', 'visible');
          $('.cc-inner .wistia_embed').css('opacity', '1');
          $('.rg-footer').css('visibility', 'visible');
        }

        // Set up search filter
        _self.utils.execIf({
          selector: '.search-filter-wrapper:visible .search-filter-content li:nth-child(1)',
          callback: function (selector) {
            $('.search-filter-wrapper:visible').parents('.nav-search').addClass('has-filter');

            var labelDefault = $('.nav-search.has-filter .search-filter-wrapper .search-filter-content li:nth-child(1)').addClass('selected').text();
            if (MadCap.Utilities.Url.GetDocumentUrl().QueryMap._Map.f) {
              labelDefault = MadCap.Utilities.Url.GetDocumentUrl().QueryMap._Map.f;
              $('.nav-search.has-filter .search-filter-wrapper .search-filter li.selected').removeClass('selected');
              $('.nav-search.has-filter .search-filter-wrapper .search-filter li:contains("' + labelDefault + '")').addClass('selected');
            }
            _self.methods.drawSearchFilter(labelDefault);

            $('.nav-search.has-filter .search-filter-wrapper').parent().mouseleave(function () {
              $(this).parents('.nav-search').removeClass('active');
            });
            $('.nav-search.has-filter .search-field,.nav-search.has-filter .search-filter-wrapper .search-filter').on(_self.utils.clickEventType(), function () {
              $('.nav-search.has-filter').addClass('active');
            });
            $('.nav-search.has-filter .search-filter-wrapper .search-filter li').on(_self.utils.clickEventType(), function () {
              $('.nav-search.has-filter .search-filter-wrapper .search-filter li.selected').removeClass('selected');
              $(this).addClass('selected');
              _self.methods.drawSearchFilter($(this).text());
            });
          },
          delay: 400,
          maxAttempts: 15
        });

        // Set up image map resize
        _self.utils.execIf({
          selector: 'map',
          callback: function (selector) {
            $(selector).imageMapResize();
          },
          delay: 400,
          maxAttempts: 5
        });

        // Add repeat method to String class
        String.prototype.repeat = function (num) {
          return new Array(isNaN(num) ? 1 : ++num).join(this);
        }

        // Home page set up
        if ($('.cc-home').length) {
          if (isTheme('Default')) {
            var logoLink = $("#portal-link").text();
            $('.title-bar-layout a.logo').attr('href', logoLink);
          }
          $('.rg-search .search').wrap('<div class="nav-search row outer-row"></div>');
          $('.rg-search .search .search-field').focus();
          $('.rg-highlights').addClass('show');
          var emptyTiles = '<li class="empty"></li><li class="empty"></li><li class="empty"></li><li class="empty"></li><li class="empty"></li><li class="empty"></li>';
          $(emptyTiles).appendTo('.rg-tiles .navigation');
        }

        // Inner page search highlights
        if ($('.cc-inner').length) {
          /* identify search results pages with highlights */
          if (/Highlight=/.test(MadCap.Utilities.Url.GetDocumentUrl().Query))
            $('body').addClass('search-highlight');

          /* if (!isTheme('Conjur')) {
            $('.nav-search').appendTo($('.title-bar-section > div'));
            $('<button class="menu-icon search" title="Search"><span></span></button>').appendTo('.menu-icon-container');
          } else { */
          $('.menu-icon.search').appendTo('.nav-search-wrapper');
          /* } */

          // Animation for search bar icon
          $('.menu-icon.search').on(_self.utils.clickEventType(), function () {
            if (/^\?q=/.test(MadCap.Utilities.Url.GetDocumentUrl().Query)) {
              if (!$('.menu-icon.search').hasClass('close')) {
                var qTerm = MadCap.Utilities.Url.GetDocumentUrl().QueryMap._Map.q;
                var qtid = setInterval(function () {
                  if (!$('.search-load').length) {
                    $('<p class="search-load">Searching ...</p>').prependTo('form.search');
                  }
                  if ($('.search-field').val() != qTerm) return;
                  clearInterval(qtid);
                  $('.search-load').addClass('hidden');
                  $('.title-bar-layout .logo-wrapper').addClass('search-open');
                  $('.title-bar-layout .logo-wrapper a.logo').addClass('search-open');
                  $('.nav-search').addClass('show');
                  $('.menu-icon.search').addClass('close');
                  $('.nav-search .search-bar').addClass('show');
                  $('.nav-search .search-field').focus();
                }, 100);
              } else {
                $('.nav-search').removeClass('show');
                $('.title-bar-layout .logo-wrapper').removeClass('search-open');
                $('.title-bar-layout .logo-wrapper a.logo').removeClass('search-open');
                $(this).removeClass('close');
              }
            } else {
              $('.title-bar-layout .logo-wrapper').toggleClass('search-open');
              $('.title-bar-layout .logo-wrapper a.logo').toggleClass('search-open');
              $('.nav-search').toggleClass('show');
              if ($('.nav-search').hasClass('show')) $('.nav-search .search-field').focus();
              $(this).toggleClass('close');
            }
          });
          if (MadCap.Utilities.Url.GetDocumentUrl().Name == "cc_Search")
            $('.menu-icon.search').trigger(_self.utils.clickEventType());

          /* Fix dropdowns with bookmarks */
          $('.MCDropDownHotSpot ~ .MCDropDownHotSpot').each(function () {
            var text = $(this).text();
            $(this).prev().prev().text(text);
            $(this).remove();
          });
        }

        /* SEARCH SYNTAX BUG */
        /* var cb = $('.search .search-submit').data('events')["click"][0].handler;
        $('.search .search-submit:visible')
          .off('doubleclick')
          .off('click', cb)
          .on('doubleclick', cb)
          .off('click')
          .on(_self.utils.clickEventType(), function (e) {
            console.log('validateSearch:::Click');
            if (_self.methods.validateSearchQuery($('.search .search-field:visible').val())) {
              console.log('Search term OK - Loading results');
              $('.search .search-submit').trigger('doubleclick');
            }
          });
        cb = $('.search .search-field:visible').data('events')["keypress"][0].handler;
        $('.search .search-field')
          .off('doubleclick')
          .off('keypress', cb)
          .on('doubleclick', cb)
          .off('keypress')
          .on('keypress', function (e) {
            if (e.which != 13) return;

            console.log('validateSearch:::Keypress');
            if (!_self.methods.validateSearchQuery($('.search .search-field:visible').val())) {
              console.log('Search term OK - Loading results');
              $('.search .search-field').trigger('doubleclick');
            }
          }); */
      });
    },
    methods: {
      setTheme: function () {
        if (isTheme('Default')) $('body').addClass('cc-theme-default');
        if (isTheme('Conjur')) $('body').addClass('cc-theme-conjur');
        if (isTheme('Secretless')) $('body').addClass('cc-theme-secretless');
        $('body').addClass('show');
      },
      // positionFooter: function () {
      //   if ($('.cc-home').length) return;
      //   var mainBottom = $('.main-section')[0].getBoundingClientRect().bottom;
      //   var $footer = $('.rg-footer');
      //   var footerHeight = $footer.height();
      //   var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName;
      //   if (mainBottom + footerHeight < viewportHeight)
      //     $footer.addClass('fixed');
      //     else
      //     $footer.removeClass('fixed');
      // },
      handleCodeWithLineNumbers: function () {
        const lineHeight = 18.4; // Fixed line height in pixels
        
        $(".code-line-numbers").each(function (index) {
          const $wrapper = $(this);
          const $codeBox = $wrapper.find("code");
          const $preBox = $wrapper.find("pre");
          
          $preBox.wrap("<div></div>");
          $preBox.prepend('<span class="numbers"></span>');
          const $lineNumbersBox = $wrapper.find(".numbers").first();
          
          const intervalId = setInterval(function () {
            const boxHeight = $codeBox.outerHeight();
            if (boxHeight > 0) {
              // Use text().split('\n') instead of height calculation
              const numberOfLines = $codeBox.text().split('\n').length;
              
              $lineNumbersBox.empty();
              for (let i = 1; i <= numberOfLines; i++) {
                const $lineNumber = $('<span>').text(i);
                $lineNumbersBox.append($lineNumber);
              }
              $wrapper.css('visibility', 'visible');
              clearInterval(intervalId); // Stop checking once done
            }
          }, 100);
        });
      },

      handleYoutubeVideos: function () {
        var vidx = 0;
        $(".videoWrapper").each(function () {
          $(this).attr("id", "video-" + vidx);
          var currentWrapper = $('#video-' + vidx);
          var iframeHTML = $(currentWrapper).find('iframe');
          var videoURL = $(iframeHTML).attr("src");
          videoURL = videoURL.replace("https://www.youtube.com/embed/", "");
          videoURL = videoURL.replace(/\?$/, '');
          var videoID = videoURL;
          var videoStructure = '<div class="videoThumbnail"><div class="playOverlay"></div><img src="https://img.youtube.com/vi/' + videoID + '/0.jpg"></div>';
          $(videoStructure).prependTo(this);
          var thisOverlay = $(currentWrapper).find('.playOverlay');
          $(iframeHTML).prependTo(thisOverlay);
          vidx++
        });

        var modal = '<div id="modalDiv" class="modalBack"><div class="modal"><div class="modalContent"></div></div></div>';
        $(modal).insertBefore("#video-0");
        var modalBackground = document.getElementById("modalDiv");
        var content = modalBackground.querySelector(".modalContent");

        window.onclick = function (event) {
          if (event.target == modalBackground) {
            closeModal();
          }
        }
        $(".playOverlay").click(function () {
          modalBackground.style.display = "flex";
          var frame = $(this);
          var str = frame[0].innerHTML;
          content.innerHTML = str;
        });

        function closeModal() {
          modalBackground.style.display = "none";
          content.innerHTML = "";
        }
      },
      buildVersionAndLangMenu: function (options) {
        if (typeof menuData != 'undefined') {
          _self.methods.buildVersionMenu(options);
          _self.methods.buildLanguageMenu(options);
        }
      },

      generateVersionMenu: function () {
        _self.utils.getFile({
          maxLevel: _self.props.urlContent.parts.length - 4,
          baseURL: _self.props.urlContent.base,
          callback: _self.methods.buildVersionAndLangMenu,
          filename: '/cc_menuDataLangs.js'
        });
        if (typeof menuData == 'undefined') {
          $('.version-label').appendTo('.logo-wrapper .rg-version');
          var versionLabelLength = $('.version-label span').text().length;
          if (versionLabelLength > 1) {
            $('.version-label').show();
          }
          return;
        }
        else {
          _self.methods.buildVersionMenu({
          });
        }
      },
      buildLanguageMenu: function (options) {
        var mList;
        var curr = {
          ver: _self.props.urlContent.parts.slice(4)[0],
          prd: _self.props.urlContent.parts.slice(3)[0],
          lang: _self.props.urlContent.parts.slice(5)[0]
        };

        let availableLangs = _self.utils.findCaseInsensitiveKey(menuData, curr.prd);

        if (availableLangs) {
          var count = $.map(availableLangs, function (n, i) { return i; }).length;

          if (count > 1) {
            var mList = '<ul>';
            $.each(availableLangs, function (key1, value1) {
              className = key1.includes(curr.lang) ? 'class="selected"' : "";
              latestVersion = value1.latest;
              let thesepaths = value1.paths
              $.each(thesepaths, function (key2, value2) {
                var thisURL = value2;
                if (thisURL.includes("/" + latestVersion + "/")) {
                  var langURL = value2;
                  mList += `<li ${className} ><a href="${menuData.baseUrl + langURL}" >` + LanguageLookup[key1].name + `</a></li>`
                }
              });
            })
            mList += '</ul>';
            $(mList).prependTo('.language > ul > li');
            $('.language').show();

          } else {
            return;
          }
        }
      },

      buildVersionMenu: function (options) {
        $('.version-label').hide();
        var mList;
        var mData = {};
        var curr = {
            ver: _self.props.urlContent.parts.slice(4)[0],
            prd: _self.props.urlContent.parts.slice(3)[0],
            lang: _self.props.urlContent.parts.slice(5)[0]
        };
        var parts;
        debug('buildVersionMenu::menuData:', menuData);
        debug('buildVersionMenu::curr:', curr);
    
        let currentProduct = _self.utils.findCaseInsensitiveKey(menuData, curr.prd);
    
        if (currentProduct) {
            let currentLang = _self.utils.findCaseInsensitiveKey(currentProduct, curr.lang);
            if (currentLang) {
                for (var i = 0; i < currentLang.paths.length; i++) {
                    parts = currentLang.paths[i].split('/');
    
                    if (!mData[parts[1]]) mData[parts[1]] = [];
                    mData[parts[1]].push({
                        'path': currentLang.paths[i]
                    });
                }
                debug('buildVersionMenu::mData:', mData);
    
                if (currentLang.latest.match(/latest/i)) {
                    return;
                } else if (!$.isEmptyObject(mData)) {
                    var versionPrefix = '<span class="label">' + LanguageLookup[curr.lang].labelPrefix + '</span> ';
                    if (isTheme('Conjur') || isTheme('Secretless')) versionPrefix = '';
                    if (curr.ver.match(/latest/i)) curr.ver = currentLang.latest;
                    let noTarget = 'href="#" onclick="return false;" target="_blank"'
                    mList = '<div class="version-control cc-main-menu"><ul><li class="has-sub-menu"><a ' + noTarget + '>' + versionPrefix + _self.props.content.version + '</a>';
                    mList += '<ul>';
                    mList += '<li class="listTitle_mobile" >Versions</li>';
                    for (var x in mData) {
                        if (x !== curr.ver) {
                            mList += '<li>';
                            var item = mData[x].pop();
                            mList += '<a data-url="' + ((x === curr.ver) ? 'javascript:void(0)"' : menuData.baseUrl + item.path + '"') + noTarget + '>'
                                + '<span class="labelPrefix_mobile">V. </span>'
                                + '<span class="labelPrefix">' + LanguageLookup[curr.lang].labelPrefix + '</span>'
                                + x + '</a>';
                            mList += '</li>';
                        }
                    }
    
                    // Add older versions link if enabled
                    if (currentLang.olderVersions && currentLang.olderVersions.enabled) {
                      mList += '<li class="older-versions">';
                      mList += '<a href="' + menuData.baseUrl + currentLang.olderVersions.url + '"' + '>'
                          + (currentLang.olderVersions.label || 'Older versions') + '</a>';
                      mList += '</li>';
                  }
    
                    mList += '</ul></li></ul></div>';
                    if (_self.props.content.version.length)
                        $(mList).insertAfter('.logo-wrapper');
              /* if ($('.version-control>ul>li').length > 1) $('.version-control').addClass('cc-has-version-dropdown'); */
                    debug('buildVersionMenu::mList:', mList);
                }
            }
        }
        /* Version menu redirects */
        // Get end of current URL
        function getCurrentUrlEnd() {
            var currentUrl = window.location.href;
            var contentIndex = currentUrl.toLowerCase().indexOf('/content/');
            if (contentIndex !== -1) {
                return currentUrl.substring(contentIndex + 1);
            }
            return '';
        }
        // Function to open the modified link
        function openModifiedLink(link) {
            // Replace Default.htm with the current URL end
            var fileName = link.attr('data-url').split('/').pop();
            // Replace the file name in the original link with the current URL end
            var modifiedHref = link.attr('data-url').replace(fileName, getCurrentUrlEnd());
            $.ajax({
                type: 'HEAD',
                url: modifiedHref,
                success: function () {
                    // If the modified link exists, open it
                    window.location.href = modifiedHref;
                },
                error: function () {
                    window.location.href = link.attr('data-url');
                }
            });
        }
        function handleLinkClick(event) {
            event.preventDefault();
            var clickedLink = $(this);
            openModifiedLink(clickedLink);
        }
        $('.version-control a').on('click', handleLinkClick);
    },
      drawSearchFilter: function (label) {
        $('.search-filter').hide();
        if (!$('#filter-label').length)
          $('<div id="filter-label"></div>').prependTo('.nav-search.has-filter .search-filter-wrapper .search-filter');
        $('#filter-label').text(label);
        $('.search-filter').fadeIn();

        var labelWidth = $('.nav-search.has-filter .search-filter-wrapper .search-filter').width();
        var inputLeft = labelWidth + 38;
        $('.cc-home .nav-search.has-filter .search-filter-wrapper').prev().animate({
          'padding-left': inputLeft
        }, 'linear');
        $('.cc-inner .nav-search.has-filter .search-filter-wrapper').prev().animate({
          'padding-left': inputLeft
        }, 'linear');
        $('.nav-search.has-filter .search-filter-wrapper').prev().attr('placeholder', $('.nav-search.has-filter .search-filter-wrapper').prev().attr('data-placeholder'));
        _self.methods.addTooltipForEllipsis($('.nav-search.has-filter .search-filter-wrapper .search-filter>div:first-child'));
        $('.nav-search.has-filter .search-field').focus();
      },
      updateHeadingsMenu: function () {
        setTimeout(function () {
          // Toggle headings menu classes for css
          $('.cc-headings-menu .selected-child-parent').removeClass('selected-child-parent');
          $('.cc-headings-menu .selected-child-menu').removeClass('selected-child-menu');
          $('.cc-headings-menu .selected-child').removeClass('selected-child');
          $('.cc-headings-menu .selected-sibling-menu').removeClass('selected-sibling-menu');
          // if ($('.cc-headings-menu .menu>li .selected').length) {
          //   $('.cc-headings-menu .menu>li .selected').removeClass('selected');
          //   $('.cc-headings-menu .menu>ul>li:first-child>a').addClass('selected');
          // }
          $('.cc-headings-menu .selected').parent().addClass('selected-child');
          $('.cc-headings-menu .selected-child').parentsUntil('.menu').addClass('selected-child-menu');
          $('.cc-headings-menu .selected-child-menu').prev().addClass('selected-child');
          $('.cc-headings-menu .selected-child').next('ul').addClass('selected-sibling-menu');
          $('.cc-headings-menu .selected-child').parents('ul:not(.menu)').last().prev().addClass('selected-child-parent');
          // if ($('body')[0].getBoundingClientRect().top < -250)
          //   $('.BackToTop').addClass('show');
          // else
          //   $('.BackToTop').removeClass('show');
        }, 0);
      },
      handleStickyMenu: function () {
        var contentHeight = $('.body-container').height();
        // console.log(contentHeight + 'is the height of the content');
        var footerVisible = $(window).height() - $('.rg-footer')[0].getBoundingClientRect().top;
        // console.log(footerVisible + ' of footer is showing');
        maxMenuHeight = contentHeight - footerVisible;
        //  console.log(maxMenuHeight + ' is the max menu height')
        if (footerVisible > 0) {
          $('ul.sidenav').css('height', maxMenuHeight + 23);
          $('.cc-headings-menu').attr('style', 'height: ' + (maxMenuHeight + 1) + 'px !important; min-height:' + (maxMenuHeight + 1) + 'px;');
        }
        else {
          $('ul.sidenav').css('height', contentHeight + 23);
          $('.cc-headings-menu').attr('style', 'height: ' + (contentHeight + 1) + 'px !important; min-height:' + (contentHeight + 1) + 'px;');
        }
        
        var $guidedFlowsMenu = $('ul._Skins_cc_GuidedFlowsMenu');
        var $headingsMenu = $('.cc-headings-menu');
        
        if (footerVisible > 0) {
            if ($guidedFlowsMenu.length > 0) {
                $guidedFlowsMenu.css('height', maxMenuHeight - 13);
            }
            if ($headingsMenu.length > 0) {
                $headingsMenu.attr('style', 'height: ' + (maxMenuHeight + 1) + 'px !important; min-height:' + (maxMenuHeight + 1) + 'px;');
            }
        } else {
            if ($guidedFlowsMenu.length > 0) {
                $guidedFlowsMenu.css('height', contentHeight - 13);
            }
            if ($headingsMenu.length > 0) {
                $headingsMenu.attr('style', 'height: ' + (contentHeight + 1) + 'px !important; min-height:' + (contentHeight + 1) + 'px;');
            }
        }
        // var elem = $('.sidenav-container')[0];
        // var hMenu = $('.col2-right .cc-headings-menu');
        // var sMenu = $('.sidenav-container .sidenav');
        // hMenu.addClass('cc-sticky');
        // console.log(elem.getBoundingClientRect().top)

        // if (elem.getBoundingClientRect().top > 110) {
        //  hMenu.removeClass('cc-sticky');
        // sMenu.removeClass('cc-sticky').css('width', '100%');
        // } else {
        //  hMenu.addClass('cc-sticky');
        //   var w = sMenu.width();
        //   sMenu.width(w).addClass('cc-sticky');
        // }

        // var scrollBottom = $(window).scrollTop() + $(window).height();
        // var menuTop = sMenu[0].getBoundingClientRect().top;
        // var maxHeight = $(document).height() - $('.rg-footer').height();
        // var footerVisible = $(window).height() - $('.rg-footer')[0].getBoundingClientRect().top;
        // if (scrollBottom > maxHeight) {
        // hMenu.css('max-height', 'calc(100vh - 165px - ' + footerVisible + 'px)');
        //   if (!sMenu.hasClass('cc-sticky')) footerVisible += 169;
        //   footerVisible += 5;
        //   sMenu.css('max-height', 'calc(100vh - ' + footerVisible + 'px)');
        // } else {
        //   console.log('sMenu::', {
        //     scrollBottom: scrollBottom,
        //     maxHeight: maxHeight,
        //     menuTop: menuTop,
        //     'cc-sticky': sMenu.hasClass('cc-sticky')
        //   });
        //   if (sMenu.hasClass('cc-sticky'))
        //     sMenu.css('max-height', '');
        //   else
        //     sMenu.css('max-height', (scrollBottom - menuTop) + 'px');
        // }
      },
      // validateSearchQuery: function (searchQuery) {
      //   if (searchQuery) {
      //     searchQuery = MadCap.Utilities.Url.StripInvalidCharacters(searchQuery);
      //     searchQuery = encodeURIComponent(searchQuery);
      //   }
      //   //console.log('validateSearchQuery:::searchQuery::', searchQuery);
      //   var _Parser = new MadCap.WebHelp.Search.Parser(searchQuery);
      //   try {
      //     //console.log('validateSearchQuery:::Try');
      //     _Parser.ParseExpression();
      //   } catch (err) {
      //     //console.log('validateSearchQuery:::' + searchQuery + '::Ensure that the search string is properly formatted.', searchQuery);
      //     alert('validateSearchQuery:::' + searchQuery + '::Ensure that the search string is properly formatted.');
      //     return false;
      //   }
      // },
      addTooltipForEllipsis: function ($el) {
        var title = $el.text();
        var $c = $el
          .clone()
          .css({
            display: 'inline-block',
            'font-size': $el.css('font-size'),
            'max-width': 'none',
            width: 'auto',
            visibility: 'hidden'
          })
          .appendTo('body');

        if ($c.width() > $el.width()) {
          $el.attr('title', title);
        } else {
          $el.removeAttr('title');
        }
        $c.remove();
      },
      // addResponsiveMenuHeader: function (item) {
      //   var armh = setInterval(function () {
      //     var mi = item.siblings('ul');
      //     if (!mi.length) return;
      //     clearInterval(armh);

      //     if (!mi.find('.responsive-menu-header').length) {
      //       mi.prepend('<div class="responsive-menu-header"><div class="responsive-menu-header-row"><span class="responsive-menu-header-title">' + _self.utils.getVar('#var-header-title') + '</span><button class="menu-icon responsive-close" title="Search"><span></span></button></div><div class="responsive-menu-header-row"></div></div>');

      //       // Back button
      //          mi.find('>.js-drilldown-back a')
      //         .addClass('responsive-menu-header-back')
      //         .appendTo(mi.find('>.responsive-menu-header .responsive-menu-header-row:nth-child(2)'));
      //       var back = item.parent().siblings('li').first();
      //       var backText = (back.parent().hasClass('is-drilldown-submenu')) ? back.text() : 'Main Menu';
      //       mi.find('>.responsive-menu-header>.responsive-menu-header-row>.responsive-menu-header-back')
      //         .text(backText)
      //         .on(_self.utils.clickEventType(), function (e) {
      //           e.preventDefault();
      //           var $ul = $(this).closest('ul');
      //           var drilldownMenu = $('ul.menu[data-drilldown]');
      //           drilldownMenu.foundation('_hide', $ul);
      //         });
      //       mi.find('>.js-drilldown-back')
      //         .removeClass('js-drilldown-back')
      //         .addClass('responsive-menu-header-parent')
      //         .append('<a href="#">' + item.text() + '</a>');
      //       debug('RM-ITEM::', item);
      //       mi.find('>.responsive-menu-header-parent').on(_self.utils.clickEventType(), function (e) {
      //         e.preventDefault();
      //       });
      //       // End back button

      //       mi.find('li:not(.js-drilldown-back) > a').on(_self.utils.clickEventType(), function () {
      //         _self.methods.addResponsiveMenuHeader($(this));
      //       });
      //       mi.find('.menu-icon.responsive-close').on(_self.utils.clickEventType(), function (e) {
      //         e.preventDefault();
      //         var drilldownMenu = $('ul.menu[data-drilldown]');
      //         var subMenus = $('ul.menu[data-drilldown] ul.is-drilldown-submenu');
      //         subMenus.each(function () {
      //           drilldownMenu.foundation('_hide', $(this));
      //         });
      //         $('.off-canvas-wrapper-inner').removeClass('is-off-canvas-open is-open-left');
      //         $('.off-canvas.position-left').removeClass('is-open').attr('aria-hidden', 'true');
      //         $('.js-off-canvas-exit').removeClass('is-visible');
      //       });
      //     }
      //   }, 100);
      // },
      setUserViewedUpdate: function () {
        let publishDate = $("#whats-new-toggle").text();
        let dateNum = Date.parse(publishDate);
        localStorage.setItem("CyberArk_Update", dateNum);
      },
      setWhatsNewToggle: function () {

        let setClickAndCheckUpdates = function () {
          $('.whats-new').click(() => _self.methods.setUserViewedUpdate());
          let whatsnewDate = $("#whats-new-toggle").text();
          let dateNum = Date.parse(whatsnewDate);
          if (valiDate(dateNum)) {
            if (contentClicked(dateNum) == false) {
              addWhatsNewClass();
            }
          }
          if ($('.whats-new-parent').length) {
            $('.whats-new').text('');
            $('.whats-new-parent').show();
          }
          // Old with timeout
          // let daysTillUpdateTimeout = 7;
          // if (valiDate(dateNum)) {
          //   $('.whats-new').text('');
          //   $('.whats-new-parent').show();
          //   if (compTodaysDate(dateNum) <= daysTillUpdateTimeout && contentClicked(dateNum) == false) {
          //     addWhatsNewClass();
          //   }
          // }
        }
        let contentClicked = function (dateNum) {
          let lastViewedUpdate = localStorage.getItem("CyberArk_Update");
          if (lastViewedUpdate == dateNum) {
            return true
          }
          else {
            return false
          }
        }
        let valiDate = function (dateNum) {
          if (Number.isInteger(dateNum) && dateNum > 1000000000000) {
            return true
          }
        }
        let compTodaysDate = function (dateNum) {
          let today = new Date();
          if (dateNum) {
            let diffInMS = today - dateNum;
            let diffInDays = diffInMS / (1000 * 60 * 60 * 24);
            return Math.round(diffInDays)
          }
          else {
            console.log("New Updates date input was invalid: " + dateNum)
            return null
          }
        }
        let addWhatsNewClass = function () {
          $('.whats-new').addClass('new');
        }
        setClickAndCheckUpdates();
      },

      setTabs: function() {
        function getTabFromHash() {
            var hash = window.location.hash.substring(1);
            if (!hash) return null;
            var tabsetMatch = hash.match(/tabset-(\d+)-tab-(\d+)/);
            if (tabsetMatch) {
                return {
                    tabSetId: 'tabset-' + tabsetMatch[1],
                    tabNumber: tabsetMatch[2],
                    isTargetElement: false
                };
            }
            return findTabContainingElement(hash);
        }
    
        function findTabContainingElement(target) {
            if (!target) return null;
            // Look for both ID and name attributes
            var targetElement = $('#' + $.escapeSelector(target)).add('[name="' + $.escapeSelector(target) + '"]').first();
            
            if (targetElement.length) {
                var tabContent = targetElement.closest('.tabs-stage > div');
                if (tabContent.length) {
                    var tabSet = tabContent.closest('.tabs');
                    var tabNumber = tabContent.index() + 1;
                    return {
                        tabSetId: tabSet.attr('id'),
                        tabNumber: tabNumber,
                        isTargetElement: true,
                        elementId: target,
                        element: targetElement[0]
                    };
                }
            }
            return null;
        }
    
        var tabSetCounter = 0;
    
        $('.tabs').each(function() {
            tabSetCounter++;
            var tabSetId = 'tabset-' + tabSetCounter;
            $(this).attr('id', tabSetId);
    
            $(this).find('.tabs-stage > div').each(function(index) {
                $(this).attr('id', tabSetId + '-tab-' + (index + 1));
            });
        });
    
        function activateTabFromHash() {
          var tabInfo = getTabFromHash();
          if (tabInfo) {
              var tabSet = $('#' + tabInfo.tabSetId);
              if (tabSet.length) {
                  var tabLink = tabSet.find('a[data-cc-tab=".tab-' + tabInfo.tabNumber + '"]');
                  if (tabLink.length) {
                      activateTab(tabSet[0], tabLink.parent()[0], tabLink.attr('data-cc-tab'));
                      if (tabInfo.isTargetElement) {
                          setTimeout(function() {
                              var targetElement = $(tabInfo.element);
                              if (targetElement.length) {
                                  $('html, body').animate({
                                      scrollTop: targetElement.offset().top
                                  }, 100);
                              }
                          }, 200);
                      }
                  }
              }
          } else if (window.location.hash) {
              $('.tabs').each(function() {
                  var tabSet = this;
                  var firstTab = $(tabSet).find('.tabs-nav li').first()[0];
                  var firstTabContent = $(tabSet).find('.tabs-nav a').first().attr('data-cc-tab');
                  
                  setActiveTab(tabSet, firstTab);
                  displayTabContent(tabSet, firstTabContent);
              });
              updateRightMenu();
          }
      }
    
        function activateTab(tabSet, activeTab, soughtTab) {
            setActiveTab(tabSet, activeTab);
            displayTabContent(tabSet, soughtTab);
            displayFirstTabInNestedTabs(tabSet);
            updateRightMenu();
            $('map').imageMapResize();
        }
    
        var displayFirstTabInNestedTabs = function(tabset) {
            let arr = tabset.getElementsByClassName('tabs');
            if (arr.length) {
                for (let nestedTab of arr) {
                    let firstTab = nestedTab.querySelector('.tabs-nav li');
                    let firstTabLink = nestedTab.querySelector('.tabs-nav a');
                    activateTab(nestedTab, firstTab, firstTabLink.getAttribute('data-cc-tab'));
                }
            }
        }
    
        var setActiveTab = function(tabset, activeTab) {
            $(tabset).find('.tab-active').removeClass('tab-active');
            $(activeTab).addClass("tab-active");
        }
    
        var displayTabContent = function(tabset, soughtTab) {
            let soughtTabContent = $(tabset).find(">.tabs-stage>" + soughtTab).first();
            let allContents = $(tabset).find('>.tabs-stage>div')
            $(allContents).hide();
            $(soughtTabContent).show();
        }

        var updateRightMenu = function() {
          let nonTabHeaders = $('.col2-content h2, .col2-content h3').filter(function() {
              return !$(this).closest('.tabs-stage').length;
          }).get();
          let visibleHeaders = [];
          $('.col2-content .tabs').each(function() {
              let visibleContent = $(this).find('.tabs-stage > div:visible');
              if (visibleContent.length) {
                  let headers = visibleContent.find('> h2, > h3').get();
                  visibleHeaders = visibleHeaders.concat(headers);
              }
          });
          
          let allHeaders = nonTabHeaders.concat(visibleHeaders).sort(function(a, b) {
              return $(a).offset().top - $(b).offset().top;
          });

          if (allHeaders.length) {
              updateSideHeaderMenu($(allHeaders));
          } else {
              $('.cc-headings-menu ul ul').empty();
          }
        }
    
        var updateSideHeaderMenu = function(displayedMenuHeaders) {
            let filteredMenu = [];
            displayedMenuHeaders.each(function(index, dmi) {
                let prev_dmi = index > 0 ? displayedMenuHeaders[index - 1] : null;
                let next_dmi = index < displayedMenuHeaders.length - 1 ? displayedMenuHeaders[index + 1] : null;
                if ($(dmi).is('h2')) {
                    filteredMenu.push('<li><a href="#' + dmi.id + '">' + dmi.innerText + '</a></li>');
                }
                
                if ($(dmi).is('h3')) {
                    if (!$(prev_dmi).is('h3')) {
                        filteredMenu.push('<ul>')
                    }
                    filteredMenu.push('<li><a href="#' + dmi.id + '">' + dmi.innerText + '</a></li>');
                    if (!$(next_dmi).is('h3')) {
                        filteredMenu.push('</ul>')
                    }
                }
            });
            
            $('.cc-headings-menu ul ul').replaceWith('<ul>' + filteredMenu.join('') + '</ul>');
            $('._Skins_cc_TopNavHeadingsMenu').foundation();
            Foundation.reInit(['magellan']);
        }
    
        function activateFirstTabsAndCollectHeadings() {
            $('.tabs').each(function(index) {
                var tabSet = this;
                var firstTab = $(tabSet).find('.tabs-nav li').first()[0];
                var firstTabContent = $(tabSet).find('.tabs-nav a').first().attr('data-cc-tab');
                setActiveTab(tabSet, firstTab);
                let soughtTabContent = $(tabSet).find(">.tabs-stage>" + firstTabContent).first();
                soughtTabContent.show();
            });
    
            setTimeout(function() {
                updateRightMenu();
                $('map').imageMapResize();
            }, 0);
        }
    
        $('.tabs-nav a').on('click', function(event) {
            event.preventDefault();
            let tabSet = $(this).closest('.tabs')[0];
            let soughtTab = $(this).attr('data-cc-tab');
            let tabNumber = soughtTab.replace('.tab-', '');
    
            activateTab(tabSet, this.parentElement, soughtTab);
    
            var currentHash = window.location.hash.substring(1);
            var newHash = tabSet.id + '-tab-' + tabNumber;
            var tabInfo = findTabContainingElement(currentHash);
    
            var shouldUpdateHash = !tabInfo || tabInfo.tabSetId !== tabSet.id || tabInfo.tabNumber !== tabNumber;
    
            if (shouldUpdateHash) {
                if (history.pushState) {
                    history.pushState(null, null, '#' + newHash);
                } else {
                    location.hash = newHash;
                }
            }
        });
    
        $(window).on('hashchange', activateTabFromHash);
        
        if (window.location.hash) {
            activateTabFromHash();
        } else {
            activateFirstTabsAndCollectHeadings();
        }
    }
    },
    utils: {
      clickEventType: function () {
        if ('ontouchstart' in document.documentElement === true)
          return 'touchstart';
        else
          return 'click';
      },
      fixStringRepeat: function () {
        if (!String.prototype.repeat) {
          String.prototype.repeat = function (count) {
            'use strict';
            if (this == null) {
              throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
              count = 0;
            }
            if (count < 0) {
              throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
              throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
              return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
              throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (var i = 0; i < count; i++) {
              rpt += str;
            }
            return rpt;
          };
        }
      },
      getVar: function (vname) {
        return $(vname).text();
      },
      getFile: function (options) {
        debug('getFile::protocol:', location.protocol);
        if (location.protocol == 'file:') {
          debug('getFile::protocol:Aborting get file on local files system');
          return false;
        }

        options.filename = options.filename || '';
        options.callback = options.callback || function () { };
        debug('getFile::options:', options);

        var filePath = options.filename;
        debug('getFile::filename:', filePath);

        $.getScript(filePath, function (data) {
          //   console.log("HERE BE DATA: " + data);

        })
          .done(function () {
            options.callback(options);
          })
          .fail(function () {

          });
      },
      isTheme: function (theme) {
        var rgx = new RegExp('Theme' + theme);
        return rgx.test($('#theme-logo>img').data('mc-conditions'));
      },
      // asyncIsMenuLoaded: function (selector, callback, length, verifyCount) {
      //   var count = $(selector + ' a').length;
      //   length = length || 0;
      //   verifyCount = verifyCount || 0;

      //   if (!$(selector).length || !length || length < count) {
      //     setTimeout(function () {
      //       _self.utils.asyncIsMenuLoaded(selector, callback, count);
      //     }, 400);
      //     return;
      //   } else if (verifyCount <= _self.options.menuVerifyConfirmedCount) {
      //     // secondary check to better assure menu loaded
      //     debug('Verify menu load count: ', verifyCount, length, count);
      //     verifyCount += ((length == count) ? 1 : 0);
      //     setTimeout(function () {
      //       _self.utils.asyncIsMenuLoaded(selector, callback, count, verifyCount);
      //     }, 400);
      //     return;
      //   }

      //   callback(selector);
      // },
      findCaseInsensitiveKey: function (data, key) {
        if (!data) {
          return undefined;
        }
        let lowerCaseKeys = Object.keys(data).map(k => k.toLowerCase());
        let index = lowerCaseKeys.indexOf(key.toLowerCase());
        return index !== -1 ? data[Object.keys(data)[index]] : undefined;
      },
      execIf: function (options) {
        options.delay = options.delay || 500;
        options.maxAttempts = options.maxAttempts || 10;
        options.verify = options.verify || false;

        var attempt = 0;
        var verified = {
          length: 0,
          done: false
        };
        var tid = setInterval(function () {
          if (!$(options.selector).length) {
            if (attempt++ >= options.maxAttempts) clearInterval(tid);
            return;
          } else if (options.verify && !verified.done) {
            if (verified.length === $(options.selector).length)
              verified.done = true;
            verified.length = $(options.selector).length;
            return;
          }
          clearInterval(tid);
          options.callback(options.selector);
        }, options.delay);
      }
    }
  };
  var debug = _self.log;
  var isTheme = _self.utils.isTheme;
  window.TopNav = _self;
  _self.init();
})(window || {});