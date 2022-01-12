"use strict";
//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function ($) {

    var $body = $('body');
    var $window = $(window);


    // Menu

    /*=============================================================
        Header Activation
        ==============================================================*/
        var primaryHeader = $('.primary-header'),
            headerClone = primaryHeader.clone();
        $('.header').after('<div class="sticky-header"></div>');
        $('.sticky-header').append(headerClone);
        var headerSelector = document.querySelector(".sticky-header");
        var triggerPoint = $('.header').height();
        var yOffset = 0;

        $(window).on('scroll', function () {
            yOffset = $(window).scrollTop();
            if (yOffset >= triggerPoint) {
                $('.sticky-header').addClass('sticky-fixed-top');
            } else {
                $('.sticky-header').removeClass('sticky-fixed-top');
            }
        });

        if ($('.primary-header').length) {
            $('.header .primary-header .burger-menu').on("click", function () {
                $(this).toggleClass('menu-open');
                $('.header .header-menu-wrap').slideToggle(300);
            });

            $('.sticky-header .primary-header .burger-menu').on("click", function () {
                $(this).toggleClass('menu-open');
                $('.sticky-header .header-menu-wrap').slideToggle(300);
            });
        }

        $('.header-menu-wrap ul li:has(ul)').each(function () {
            $(this).append('<span class="dropdown-plus"></span>');
            $(this).addClass('dropdown_menu');
        });

        $('.header-menu-wrap .dropdown-plus').on("click", function () {
            $(this).prev('ul').slideToggle(300);
            $(this,).toggleClass('dropdown-open');
            $('.header-menu-wrap ul li:has(ul)').toggleClass('dropdown-open');
        });

        $('.header-menu-wrap .dropdown_menu a').append('<span></span>');

                /* ========== Popup Search Box ========== */
                $(function () {
                    $('#dl-popup-search-box').removeClass('toggled');

                    $('.dl-search-icon').on('click', function (e) {
                        e.stopPropagation();
                        $('#dl-popup-search-box').toggleClass('toggled');
                        $("#popup-search").focus();
                    });

                    $('#dl-popup-search-box input').on('click', function (e) {
                        e.stopPropagation();
                    });

                    $('#dl-popup-search-box, body').on('click', function () {
                        $('#dl-popup-search-box').removeClass('toggled');
                    });
                });

//photoSwipe gallery plugin
    function initPhotoSwipe() {
        if (typeof PhotoSwipe !== 'undefined') {

            //adding prettyPhoto for backward compatibility. Deprecated.
            //will leave only .photoswipe-link later
            var gallerySelectors = '.photoswipe-link, a[data-gal^="prettyPhoto"], [data-thumb] a';
            var $galleryLinks = $(gallerySelectors);
            if ($galleryLinks.length) {

                //adding photoswipe gallery markup
                if (!($('.pswp').length)) {
                    $body.append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><a class="pswp__button pswp__button--close" title="Close (Esc)"></a><a class="pswp__button pswp__button--share" title="Share"></a><a class="pswp__button pswp__button--fs" title="Toggle fullscreen"></a><a class="pswp__button pswp__button--zoom" title="Zoom in/out"></a><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div> </div><a class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></a><a class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></a><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
                    //if function already was called - return (all listeners was setted and .pswp gallery container was added)
                } else {
                    return;
                }
                //adding prettyPhoto for backward compatibility. Deprecated.
                $('body').on('click', gallerySelectors, function (e) {
                    e.preventDefault();

                    var $link = $(this);
                    var $linksParentContainer = $link.closest('.photoswipe-container, .isotope-wrapper, .owl-carousel, .flickr_ul, .images');
                    var $links = $linksParentContainer.find(gallerySelectors);
                    //for cloned owl-carousel items - continue to prevent duplicating - moved to EACH loop
                    //start index does not work with owl-carousel loop enabled
                    // if ($linksParentContainer.is('.owl-carousel')) {
                    // 	$links = $links.filter(function (index) {
                    // 		return !($(this).closest('.cloned').length);
                    // 	});
                    // }
                    //if no container only adding this link
                    if (!$links.length) {
                        $links.push($link);
                    }
                    var items = [];
                    var options = {
                        bgOpacity: 0.7,
                        showHideOpacity: true,
                        history: false,
                        shareEl: false,
                        //data index is set in owl carousel init
                        index: $link.data('index') ? $link.data('index') : 0
                    };
                    var gallery = $('.pswp')[0];
                    //building items array
                    $links.each(function (i) {
                        var $this = $(this);
                        //if cloned element (owl or flexslider thumbs) - continue
                        if ($this.closest('.clone, .cloned').length) {
                            return;
                        }
                        //TODO think about hide items that are not showing after filtering and renew indexes for them
                        // if ($linksParentContainer.hasClass('isotope-wrapper') && !$this.is(':visible')) {
                        // 	return;
                        // }
                        var item = {};
                        //if not owl carousel
                        if (($link[0] === $this[0]) && !($link.data('index'))) {
                            //start from 0
                            if ($linksParentContainer.hasClass('owl-carousel') || $linksParentContainer.hasClass('images')) {
                                options.index = i - 1;
                            } else {
                                options.index = i;
                            }
                        }
                        //video or image
                        if ($this.data('iframe')) {
                            //for wordpress - iframe tag is escaped
                            //item.html = $this.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"');
                            //for html - building iframe manually
                            //autoplay only if 1 iframe in gallery
                            var autoplay = ($links.length > 1) ? '' : '&autoplay=1';
                            item.html = '<div class="embed-responsive embed-responsive-16by9">';
                            // item.html += '<iframe class="embed-responsive-item" src="'+ $(this).data('iframe') + '?rel=0&autoplay=1'+ '"></iframe>';
                            item.html += '<iframe class="embed-responsive-item" src="' + $(this).data('iframe') + '?rel=0' + autoplay + '&enablejsapi=1&api=1"></iframe>';
                            item.html += '</div>';
                        } else {
                            item.src = $this.attr('href');
                            if ($this.find('figure')) {
                                item.title = $this.find('figure').text()
                            }

                            //default values
                            var width = 1170;
                            var height = 780;
                            //template data on A element
                            var data = $this.data();
                            //image data in Woo
                            var dataImage = $this.find('img').first().data();
                            if (data.width) {
                                width = data.width;
                            }
                            if (data.height) {
                                height = data.height;
                            }
                            if (typeof dataImage !== 'undefined') {
                                if (dataImage.large_image_width) {
                                    width = dataImage.large_image_width;
                                }
                                if (dataImage.large_image_height) {
                                    height = dataImage.large_image_height;
                                }
                            }
                            item.w = width;
                            item.h = height;
                            console.log(item)
                        }
                        items.push(item);
                    });

                    var pswpGallery = new PhotoSwipe(gallery, PhotoSwipeUI_Default, items, options);
                    pswpGallery.init();

                    //pausing video on close and on slide change
                    pswpGallery.listen('afterChange', function () {
                        $(pswpGallery.container).find('iframe').each(function () {
                            //"method":"pause" - form Vimeo, other - for YouTube
                            $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                        });
                    });
                    pswpGallery.listen('close', function () {
                        $(pswpGallery.container).find('iframe').each(function () {
                            //"method":"pause" - form Vimeo, other - for YouTube
                            $(this)[0].contentWindow.postMessage('{"method":"pause","event":"command","func":"pauseVideo","args":""}', '*')
                        });
                    });

                });
            }

        }
    }

//helper functions to init elements only when they appears in viewport (jQUery.appear plugin)
    function initAnimateElement(self, index) {
        var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
        var animationDelay = !self.data('delay') ? 150 : self.data('delay');
        setTimeout(function () {
            self.addClass("animated " + animationClass);
        }, index * animationDelay);
    }

    function initCounter(self) {
        if (self.hasClass('counted')) {
            return;
        } else {
            self.countTo().addClass('counted');
        }
    }



    function initRotateText() {
        if (document.querySelector('.iq-rotate-text')) {
            document.querySelectorAll('.iq-rotate-text').forEach(item => {
                new CircleType(item).radius(88)
            })
        }
    }

    function selectWrapper() {
        // wrap select fields
        $('select').each(function () {
            let s = $(this);
            s.wrap('<div class="select_container"></div>');
        });
    }

    function customNav() {
        let $carouseCustom = $('.owl-custom-nav');
        let $carouseCustomSection = $carouseCustom.closest('section');
        $carouseCustomSection.find('.owl-custom-nav .owl-prev').on('click', function (e) {
            e.preventDefault();
            $carouseCustomSection.find('.owl-carousel').trigger('prev.owl');
        });
        $carouseCustomSection.find('.owl-custom-nav .owl-next').on('click', function (e) {
            e.preventDefault();
            $carouseCustomSection.find('.owl-carousel').trigger('next.owl');
        });
    }

    function Parallax(options) {
        options = options || {};
        this.nameSpaces = {
            wrapper: options.wrapper || '.parallax',
            layers: options.layers || '.parallax-layer',
            deep: options.deep || 'data-parallax-deep'
        };
        this.init = function () {
            var self = this,
                parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
            for (var i = 0; i < parallaxWrappers.length; i++) {
                (function (i) {
                    parallaxWrappers[i].addEventListener('mousemove', function (e) {
                        var x = e.clientX,
                            y = e.clientY,
                            layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
                        for (var j = 0; j < layers.length; j++) {
                            (function (j) {
                                var deep = layers[j].getAttribute(self.nameSpaces.deep),
                                    disallow = layers[j].getAttribute('data-parallax-disallow'),
                                    itemX = (disallow && disallow === 'x') ? 0 : x / deep,
                                    itemY = (disallow && disallow === 'y') ? 0 : y / deep;
                                if (disallow && disallow === 'both') return;
                                layers[j].style.transform = 'translateX(' + itemX + '%) translateY(' + itemY * 4 + '%)';
                            })(j);
                        }
                    })
                })(i);
            }

        };
        this.init();
        return this;
    }

    function btnAnimate() {
        let $btns = $('.btn:not(.btn-default)');
        if ($btns.length) {
            $btns.each(function () {
                let self = $(this);
                let content = self.text();
                self.attr('data-content', content).text('').html('<span>' + content + '</span>')
            })
        }
    }

    function formAnimation() {
        let $forms = $('.form-control');
        $forms.each(function () {
            let self = $(this);
            self.after('<span class="border-animate"></span>')
        })
    }



//function that initiating template plugins on window.load event
    function documentReadyInit() {

        formAnimation();

        btnAnimate();

        //////////////////
        //Parallax mouse//
        //////////////////
        new Parallax();

        customNav();

        //////////////
        //rotateText//
        //////////////
        initRotateText();

        //////////////
        //selectWrap//
        //////////////
        selectWrapper();

        //side header processing
        var $sideHeader = $('.page_header_side');
        // toggle sub-menus visibility on menu-click
        $('ul.menu-click').find('li').each(function () {
            var $thisLi = $(this);
            //toggle submenu only for menu items with submenu
            if ($thisLi.find('ul').length) {
                $thisLi
                    .append('<span class="toggle_submenu color-darkgrey"></span>')
                    //adding anchor
                    .find('.toggle_submenu, > a')
                    .on('click', function (e) {
                        var $thisSpanOrA = $(this);
                        //if this is a link and it is already opened - going to link
                        if (($thisSpanOrA.attr('href') === '#') || !($thisSpanOrA.parent().hasClass('active-submenu'))) {
                            e.preventDefault();
                        }
                        if ($thisSpanOrA.parent().hasClass('active-submenu')) {
                            $thisSpanOrA.parent().removeClass('active-submenu');
                            return;
                        }
                        $thisLi.addClass('active-submenu').siblings().removeClass('active-submenu');
                    });
            } //eof sumbenu check
        });
        if ($sideHeader.length) {
            $('.toggle_menu_side').on('click', function () {
                var $thisToggler = $(this);
                $thisToggler.toggleClass('active');
                if ($thisToggler.hasClass('header-slide')) {
                    $sideHeader.toggleClass('active-slide-side-header');
                } else {
                    if ($thisToggler.parent().hasClass('header_side_right')) {
                        $body.toggleClass('active-side-header slide-right');
                    } else {
                        $body.toggleClass('active-side-header');
                    }
                    $body.parent().toggleClass('html-active-push-header');
                }
                //fixing mega menu and aside affix on toggling side sticked header
                if ($thisToggler.closest('.header_side_sticked').length) {
                    initMegaMenu(600);
                    var $affixAside = $('.affix-aside');
                    if ($affixAside.length) {
                        $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({
                            "width": "",
                            "left": ""
                        }).trigger('affix-top.bs.affix');
                        setTimeout(function () {
                            $affixAside.removeClass("affix affix-bottom").addClass("affix-top").css({
                                "width": "",
                                "left": ""
                            }).trigger('affix-top.bs.affix');
                        }, 10);
                    }
                }
            });
            //hidding side header on click outside header
            $body.on('mousedown touchstart', function (e) {
                if (!($(e.target).closest('.page_header_side').length) && !($sideHeader.hasClass('header_side_sticked'))) {
                    $sideHeader.removeClass('active-slide-side-header');
                    $body.removeClass('active-side-header slide-right');
                    $body.parent().removeClass('html-active-push-header');
                    var $toggler = $('.toggle_menu_side');
                    if (($toggler).hasClass('active')) {
                        $toggler.removeClass('active');
                    }
                }
            });
        } //sideHeader check

        //1 and 2/3/4th level offscreen fix
        var MainWindowWidth = $window.width();
        $window.on('resize', function () {
            MainWindowWidth = $(window).width();
        });
        //2/3/4 levels
        $('.top-nav .sf-menu').on('mouseover', 'ul li', function () {
            // $('.mainmenu').on('mouseover', 'ul li', function(){
            if (MainWindowWidth > 991) {
                var $this = $(this);
                // checks if third level menu exist
                var subMenuExist = $this.find('ul').length;
                if (subMenuExist > 0) {
                    var subMenuWidth = $this.find('ul, div').first().width();
                    var subMenuOffset = $this.find('ul, div').first().parent().offset().left + subMenuWidth;
                    // if sub menu is off screen, give new position
                    if ((subMenuOffset + subMenuWidth) > MainWindowWidth) {
                        var newSubMenuPosition = subMenuWidth + 0;
                        $this.find('ul, div').first().css({
                            left: -newSubMenuPosition,
                        });
                    } else {
                        $this.find('ul, div').first().css({
                            left: '100%',
                        });
                    }
                }
            }
            //1st level
        }).on('mouseover', '> li', function () {
            if (MainWindowWidth > 991) {
                var $this = $(this);
                var subMenuExist = $this.find('ul').length;
                if (subMenuExist > 0) {
                    var subMenuWidth = $this.find('ul').width();
                    var subMenuOffset = $this.find('ul').parent().offset().left;
                    // if sub menu is off screen, give new position
                    if ((subMenuOffset + subMenuWidth) > MainWindowWidth) {
                        var newSubMenuPosition = MainWindowWidth - (subMenuOffset + subMenuWidth);
                        $this.find('ul').first().css({
                            left: newSubMenuPosition,
                        });
                    }
                }
            }
        });

        /////////////////////////////////////////
        //single page localscroll and scrollspy//
        /////////////////////////////////////////
        var navHeight = $('.page_header').outerHeight(true);
        if ($().localScroll) {
            $('.top-nav > ul, .mainmenu_side_wrapper > ul, #land,  .comments-link').localScroll({
                duration: 200,
                easing: 'easeInOutQuad',
                offset: -navHeight + 40
            });
        }

        //background image teaser and sections with half image bg
        //put this before prettyPhoto init because image may be wrapped in prettyPhoto link
        $(".bg_teaser, .cover-image").each(function () {
            var $element = $(this);
            var $image = $element.find("img").first();
            if (!$image.length) {
                $image = $element.parent().find("img").first();
            }
            if (!$image.length) {
                return;
            }
            var imagePath = $image.attr("src");
            $element.css("background-image", "url(" + imagePath + ")");
            var $imageParent = $image.parent();
            //if image inside link - adding this link, removing gallery to preserve duplicating gallery items
            if ($imageParent.is('a')) {
                $element.prepend($image.parent().clone().html(''));
                $imageParent.attr('data-gal', '');
            }
        });

        //video images preview - from WP
        $('.embed-placeholder').each(function () {
            $(this).on('click', function (e) {
                var $thisLink = $(this);
                // if prettyPhoto popup with YouTube - return
                if ($thisLink.attr('data-gal')) {
                    return;
                }
                e.preventDefault();
                if ($thisLink.attr('href') === '' || $thisLink.attr('href') === '#') {
                    $thisLink.replaceWith($thisLink.data('iframe').replace(/&amp/g, '&').replace(/$lt;/g, '<').replace(/&gt;/g, '>').replace(/$quot;/g, '"')).trigger('click');
                } else {
                    $thisLink.replaceWith('<iframe class="embed-responsive-item" src="' + $thisLink.attr('href') + '?rel=0&autoplay=1' + '"></iframe>');
                }
            });
        });

        //toTop
        if ($().UItoTop) {
            if (document.querySelector('.page_header_side_theme')) {
                $().UItoTop({
                    easingType: 'easeInOutQuart',
                    inDelay: 400,
                    outDelay: 300,
                    scrollSpeed: 200,
                    customClass: 'toTopHeader'
                });
            } else {
                $().UItoTop({
                    easingType: 'easeInOutQuart', inDelay: 400,
                    outDelay: 300, scrollSpeed: 200
                });
            }

        }

        //parallax
        if ($().parallax) {
            $('.s-parallax').parallax("50%", 0.01);
        }

        //prettyPhoto
        if ($().prettyPhoto) {
            $("a[data-gal^='prettyPhoto']").prettyPhoto({
                hook: 'data-gal',
                theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
            });
        }
        initPhotoSwipe();

        ////////////////////////////////////////
        //init Bootstrap JS components//
        ////////////////////////////////////////
        //adding .form-control class for search widgets
        $('[type="search"]').addClass('form-control');


        //bootstrap carousel
        if ($().carousel) {
            $('.carousel').carousel();
        }
        //bootstrap tab - show first tab
        $('.nav-tabs').each(function () {
            $(this).find('a').first().tab('show');
        });
        //video in bootstrap tabs
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var iframe = $(e.relatedTarget.hash).find('iframe');
            var src = iframe.attr('src');
            iframe.attr('src', '');
            iframe.attr('src', src);
        });

        $('.tab-content').each(function () {
            $(this).find('.tab-pane').first().addClass('fade in');
        });
        //bootstrap collapse - show first tab
        $('.panel-group').each(function () {
            $(this).find('a').first().filter('.collapsed').trigger('click');
        });
        //tooltip
        if ($().tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        //comingsoon counter
        if ($().countdown) {
            var $counter = $('#comingsoon-countdown');
            //today date plus month for demo purpose
            var date = ($counter.data('date') !== 'undefined') ? $counter.data('date') : false;
            if (date) {
                date = new Date(date);
            } else {
                date = new Date();
                date.setMonth(date.getMonth() + 1);
            }
            $counter.countdown({until: date});
        }

    }

//function that initiating template plugins on window.load event
    function windowLoadInit() {
        //////////////
        //flexslider//
        //////////////
        if ($().flexslider) {
            var $introSlider = $(".page_slider .flexslider");
            $introSlider.each(function (index) {
                var $currentSlider = $(this);
                var data = $currentSlider.data();
                var nav = (data.nav !== 'undefined') ? data.nav : true;
                var dots = (data.dots !== 'undefined') ? data.dots : true;
                var speed = (data.speed !== 'undefined') ? data.speed : 7000;

                $currentSlider.flexslider({
                    customDirectionNav: $(".custom-navigation a"),
                    animation: "fade",
                    pauseOnHover: true,
                    useCSS: true,
                    controlNav: false,
                    directionNav: nav,
                    prevText: "",
                    nextText: "",
                    smoothHeight: false,
                    slideshowSpeed: speed,
                    animationSpeed: 600,
                    start: function (slider) {
                        flexSliderCountNav();
                        slider.find('.intro_layers').children().css({'visibility': 'hidden'});
                        slider.find('.flex-active-slide .intro_layers').children().each(function (index) {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            setTimeout(function () {
                                self.addClass("animated " + animationClass);
                            }, index * 250);
                        });
                    },
                    after: function (slider) {
                        flexSliderCountNav();
                        slider.find('.flex-active-slide .intro_layers').children().each(function (index) {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            setTimeout(function () {
                                self.addClass("animated " + animationClass);
                            }, index * 250);
                        });
                    },
                    end: function (slider) {
                        slider.find('.intro_layers').children().each(function () {
                            var self = $(this);
                            var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
                            self.removeClass('animated ' + animationClass).css({'visibility': 'hidden'});
                            // $(this).attr('class', '');
                        });
                    },

                })
                //wrapping nav with container - uncomment if need
                // .find('.flex-control-nav')
                // .wrap('<div class="container nav-container"/>')
            }); //.page_slider flex slider

            $(".flexslider").each(function (index) {
                var $currentSlider = $(this);
                //exit if intro slider already activated
                if ($currentSlider.find('.flex-active-slide').length) {
                    return;
                }
                $currentSlider.flexslider({
                    animation: "fade",
                    useCSS: true,
                    controlNav: true,
                    directionNav: false,
                    prevText: "",
                    nextText: "",
                    smoothHeight: false,
                    slideshowSpeed: 5000,
                    animationSpeed: 800,
                })
            });
        }

        ////////////////
        //owl carousel//
        ////////////////
        if ($().owlCarousel) {
            $('.owl-carousel').each(function () {
                var $carousel = $(this);
                $carousel.find('> *').each(function (i) {
                    $(this).attr('data-index', i);
                });
                var data = $carousel.data();

                var loop = data.loop ? data.loop : false,
                    margin = (data.margin || data.margin === 0) ? data.margin : 30,
                    nav = data.nav ? data.nav : false,
                    navPrev = data.navPrev ? data.navPrev : '<i class="fa fa-chevron-left">',
                    navNext = data.navNext ? data.navNext : '<i class="fa fa-chevron-right">',
                    dots = data.dots ? data.dots : false,
                    themeClass = data.themeclass ? data.themeclass : 'owl-theme',
                    center = data.center ? data.center : false,
                    items = data.items ? data.items : 4,
                    autoplay = data.autoplay ? data.autoplay : false,
                    responsiveXs = data.responsiveXs ? data.responsiveXs : 1,
                    responsiveSm = data.responsiveSm ? data.responsiveSm : 2,
                    responsiveMd = data.responsiveMd ? data.responsiveMd : 3,
                    responsiveLg = data.responsiveLg ? data.responsiveLg : 4,
                    draggable = (data.draggable === false) ? data.draggable : true,
                    syncedClass = (data.syncedClass) ? data.syncedClass : false,
                    filters = data.filters ? data.filters : false;

                if (filters) {
                    $carousel.after($carousel.clone().addClass('owl-carousel-filter-cloned'));
                    $(filters).on('click', 'a', function (e) {
                        //processing filter link
                        e.preventDefault();
                        if ($(this).hasClass('selected')) {
                            return;
                        }
                        var filterValue = $(this).attr('data-filter');
                        $(this).siblings().removeClass('selected active');
                        $(this).addClass('selected active');

                        //removing old items
                        for (var i = $carousel.find('.owl-item').length - 1; i >= 0; i--) {
                            $carousel.trigger('remove.owl.carousel', [1]);
                        }
                        ;

                        //adding new items
                        var $filteredItems = $($carousel.next().find(' > ' + filterValue).clone());
                        $filteredItems.each(function () {
                            $carousel.trigger('add.owl.carousel', $(this));
                            $(this).addClass('scaleAppear');
                        });

                        $carousel.trigger('refresh.owl.carousel');

                        //reinit prettyPhoto in filtered OWL carousel
                        if ($().prettyPhoto) {
                            $carousel.find("a[data-gal^='prettyPhoto']").prettyPhoto({
                                hook: 'data-gal',
                                theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
                            });
                        }
                    });

                } //filters

                $carousel.owlCarousel({
                    loop: loop,
                    margin: margin,
                    nav: nav,
                    autoplay: autoplay,
                    dots: dots,
                    themeClass: themeClass,
                    center: center,
                    navText: [navPrev, navNext],
                    mouseDrag: draggable,
                    touchDrag: draggable,
                    items: items,
                    // autoHeight: true,
                    responsive: {
                        0: {
                            items: responsiveXs
                        },
                        767: {
                            items: responsiveSm
                        },
                        992: {
                            items: responsiveMd
                        },
                        1200: {
                            items: responsiveLg
                        }
                    },
                })
                    .addClass(themeClass);
                if (center) {
                    $carousel.addClass('owl-center');
                }

                $window.on('resize', function () {
                    $carousel.trigger('refresh.owl.carousel');
                });

                //topline two synced carousels
                if ($carousel.hasClass('owl-news-slider-items') && syncedClass) {
                    $carousel.on('changed.owl.carousel', function (e) {
                        var indexTo = loop ? e.item.index + 1 : e.item.index;
                        $(syncedClass).trigger('to.owl.carousel', [indexTo]);
                    })
                }


            });


        } //eof owl-carousel

        $body.scrollspy('refresh');

        //appear plugin is used to elements animation, counter, pieChart, bootstrap progressbar
        if ($().appear) {
            //animation to elements on scroll
            var $animate = $('.animate');
            $animate.appear();

            $animate.filter(':appeared').each(function (index) {
                initAnimateElement($(this), index);
            });

            $body.on('appear', '.animate', function (e, $affected) {
                $($affected).each(function (index) {
                    initAnimateElement($(this), index);
                });
            });

            //counters init on scroll
            if ($().countTo) {
                var $counter = $('.counter');
                $counter.appear();

                $counter.filter(':appeared').each(function () {
                    initCounter($(this));
                });
                $body.on('appear', '.counter', function (e, $affected) {
                    $($affected).each(function () {
                        initCounter($(this));
                    });
                });
            }

            //bootstrap animated progressbar
            if ($().progressbar) {
                var $progressbar = $('.progress .progress-bar');
                $progressbar.appear();

                $progressbar.filter(':appeared').each(function () {
                    initProgressbar($(this));
                });
                $body.on('appear', '.progress .progress-bar', function (e, $affected) {
                    $($affected).each(function () {
                        initProgressbar($(this));
                    });
                });
                //animate progress bar inside bootstrap tab
                $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    initProgressbar($($(e.target).attr('href')).find('.progress .progress-bar'));
                });
                //animate progress bar inside bootstrap dropdown
                $('.dropdown').on('shown.bs.dropdown', function (e) {
                    initProgressbar($(this).find('.progress .progress-bar'));
                });
            }

            //circle progress bar
            if ($().easyPieChart) {
                var $chart = $('.chart');

                $chart.appear();

                $chart.filter(':appeared').each(function () {
                    initChart($(this));
                });
                $body.on('appear', '.chart', function (e, $affected) {
                    $($affected).each(function () {
                        initChart($(this));
                    });
                });

            }

        } //appear check

        //Flickr widget
        // use http://idgettr.com/ to find your ID
        if ($().jflickrfeed) {
            var $flickr = $("#flickr, .flickr_ul");
            if ($flickr.length) {
                if (!($flickr.hasClass('flickr_loaded'))) {
                    $flickr.jflickrfeed({
                        flickrbase: "http://api.flickr.com/services/feeds/",
                        limit: 4,
                        qstrings: {
                            id: "131791558@N04"
                        },
                        itemTemplate: '<a href="{{image_b}}" class="photoswipe-link"><li><img alt="{{title}}" src="{{image_m}}" /></li></a>'
                        //complete
                    }, function (data) {
                        initPhotoSwipe();
                    }).addClass('flickr_loaded');
                }
            }
        }

        // Instagram widget
        if ($().spectragram) {
            var Spectra = {
                instaToken: '3905738328.60c782d.b65ed3f058d64e6ab32c110c6ac12d9b',
                instaID: '60c782dfecaf4050b59ff4c159246641',

                init: function () {
                    jQuery.fn.spectragram.accessData = {
                        accessToken: this.instaToken,
                        clientID: this.instaID
                    };

                    //available methods: getUserFeed, getRecentTagged
                    $('.instafeed').each(function () {
                        var $this = $(this);
                        if ($this.find('img').length) {
                            return;
                        }
                        $this.spectragram({
                            max: 8,
                            size: "medium",
                            wrapEachWith: '<div class="photo">'
                        });
                    });
                }
            }
            Spectra.init();
        }

        // init Isotope
        $('.isotope-wrapper').each(function (index) {
            var $container = $(this);
            var layoutMode = ($container.hasClass('masonry-layout')) ? 'masonry' : 'fitRows';
            var columnWidth = ($container.children('.col-md-4').length) ? '.col-md-4' : false;
            $container.isotope({
                percentPosition: true,
                layoutMode: layoutMode,
                masonry: {
                    //TODO for big first element in grid - giving smaller element to use as grid
                    // columnWidth: '.isotope-wrapper > .col-md-4'
                    columnWidth: columnWidth
                }
            });

            var $filters = $container.attr('data-filters') ? $($container.attr('data-filters')) : $container.prev().find('.filters');
            // bind filter click
            if ($filters.length) {
                $filters.on('click', 'a', function (e) {
                    e.preventDefault();
                    var $thisA = $(this);
                    var filterValue = $thisA.attr('data-filter');
                    $container.isotope({filter: filterValue});
                    $thisA.siblings().removeClass('selected active');
                    $thisA.addClass('selected active');
                });
                //for works on select
                $filters.on('change', 'select', function (e) {
                    e.preventDefault();
                    var filterValue = $(this).val();
                    $container.isotope({filter: filterValue});
                });
            }
        });

        (function () {
            let $container = $('.grid-container');
            var $filters = $container.attr('data-filters') ? $($container.attr('data-filters')) : $container.prev().find('.filters');
            // bind filter click
            if ($filters.length) {
                $filters.on('click', 'a', function (e) {
                    e.preventDefault();
                    // Filters menu
                    var $thisA = $(this);
                    var filterValue = $thisA.attr('data-filter');
                    $thisA.siblings().removeClass('selected active');
                    $thisA.addClass('selected active');

                    // Filters elements
                    let boxs = document.querySelectorAll('.grid-box');
                    boxs.forEach(function (box) {
                        box.classList.add('hide');
                        let timeout = setTimeout(function () {
                            box.classList.add('d-none');
                        }, 300);
                        let toggle = function () {
                            box.classList.remove('hide');
                            clearTimeout(timeout);
                            box.classList.remove('d-none');
                        };
                        (filterValue === '*' || box.classList.contains(filterValue.slice(1))) ? toggle() : true;
                    });
                });
            }
        })();

        $('.title-custom').each(function (index) {
            if (!index % 2) {
                $(this).marquee({
                    direction: 'left',
                    duration: 10000,
                    gap: 50,
                    delayBeforeStart: 0,
                    duplicated: true,
                    startVisible: true,
                    pauseOnHover: true,
                    pauseOnCycle: 0
                });
            } else {
                $(this).marquee({
                    direction: 'right',
                    duration: 10000,
                    gap: 50,
                    delayBeforeStart: 0,
                    duplicated: true,
                    startVisible: true,
                    pauseOnHover: true,
                    pauseOnCycle: 0
                });
            }

        })

        $(".contact_modal").on('click', function(e){
            e.preventDefault();
            $('#contact_modal').modal('show').addClass('center').find('input').first().focus();
        });

        $(".registrate_modal_window").on('click', function(e){
            e.preventDefault();
            $(this).closest('.modal').find('.remove').trigger('click');
            $('#registrate_modal').modal('show').addClass('center').find('input').first().focus();
        });

        $(".modal_window .remove").on('click', function(e){
            e.stopPropagation();
            $('body').trigger('click');
        });

        /////////
        //SHOP///
        /////////
        $('#toggle_shop_view').on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('grid-view');
            $('#products').toggleClass('grid-view list-view');
        });


        //checkout collapse forms - only for HTML
        $('a.showlogin, a.showcoupon').on('click', function (e) {
            e.preventDefault();
            var $form = $(this).parent().next();

            if ($form.css('display') === 'none') {
                $form.show(150);
            } else {
                $form.hide(150);
            }
        });


        //remove product from cart - only for HTML
        $('a.remove').on('click', function (e) {
            e.preventDefault();
            $(this).closest('tr, .media').remove();
        });


        //flexslider - only for HTML
        $('.images').flexslider({
            animation: "slide",
            controlNav: "thumbnails",
            selector: "figure > div",
            directionNav: true,
        });

        //tabs - only for HTML
        $('.wc-tab, .woocommerce-tabs .panel:not(.panel .panel)').hide();

        $('.wc-tabs li a, ul.tabs li a').on('click', function (e) {
            e.preventDefault();
            var $tab = $(this);
            var $tabs_wrapper = $tab.closest('.wc-tabs-wrapper, .woocommerce-tabs');
            var $tabs = $tabs_wrapper.find('.wc-tabs, ul.tabs');

            $tabs.find('li').removeClass('active');
            $tabs_wrapper.find('.wc-tab, .panel:not(.panel .panel)').hide();

            $tab.closest('li').addClass('active');
            $tabs_wrapper.find($tab.attr('href')).show();
        });
        // Review link
        $('a.woocommerce-review-link').on('click', function () {
            $('.reviews_tab a').trigger('click');
            return true;
        });

        //parsing URL hash
        var hash = window.location.hash;
        var url = window.location.href;
        var $tabs = $('.wc-tabs, ul.tabs').first();

        if (hash.toLowerCase().indexOf('comment-') >= 0 || hash === '#reviews' || hash === '#tab-reviews') {
            $tabs.find('li.reviews_tab a').trigger('click');
        } else if (url.indexOf('comment-page-') > 0 || url.indexOf('cpage=') > 0) {
            $tabs.find('li.reviews_tab a').trigger('click');
        } else if (hash === '#tab-additional_information') {
            $tabs.find('li.additional_information_tab a').trigger('click');
        } else {
            $tabs.find('li:first a').trigger('click');
        }


        //price filter - only for HTML
        if ($().slider) {
            var $rangeSlider = $(".slider-range-price");
            if ($rangeSlider.length) {
                var $priceMin = $(".slider_price_min");
                var $priceMax = $(".slider_price_max");
                $rangeSlider.slider({
                    range: true,
                    min: 0,
                    max: 100000,
                    values: [1500, 30000],
                    slide: function (event, ui) {
                        $priceMin.val(ui.values[0]);
                        $priceMax.val(ui.values[1]);
                    }
                });
                $priceMin.val($rangeSlider.slider("values", 0));
                $priceMax.val($rangeSlider.slider("values", 1));
            }
        }


        //woocommerce related products, upsells products
        $('.related.products ul.products, .upsells.products ul.products, .cross-sells ul.products')
            .addClass('owl-carousel top-right-nav')
            .owlCarousel({
                loop: true,
                autoplay: true,
                margin: 30,
                nav: true,
                dots: false,
                items: 3,
                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                autoHeight: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    767: {
                        items: 2
                    },
                    992: {
                        items: 2
                    },
                    1200: {
                        items: 3
                    }
                }
            });

        //color filter
        $(".color-filters").find("a[data-background-color]").each(function () {
            $(this).css({"background-color": $(this).data("background-color")});
        });
        ////////////////
        // end of SHOP//
        ////////////////


        //Unyson or other messages modal
        var $messagesModal = $('#messages_modal');
        if ($messagesModal.find('ul').length) {
            $messagesModal.modal('show');
        }

        //page preloader
        $(".preloaderimg").fadeOut(150);
        $(".preloader").fadeOut(150).delay(50, function () {
            $(this).remove();
        });
    }//eof windowLoadInit

    $(document).ready(function () {
        documentReadyInit();
    });

    $window.on('load', function () {
        windowLoadInit();
    }); //end of "window load" event

    $window.on('resize', function () {

        $body.scrollspy('refresh');

        //header processing
        var $header = $('.page_header').first();
        //checking document scrolling position
        if ($header.length && !$(document).scrollTop() && $header.first().data('bs.affix')) {
            $header.first().data('bs.affix').options.offset.top = $header.offset().top;
        }
        if (!$header.closest('.boxed').length) {
            var affixed = false;
            if ($header.hasClass('affix')) {
                affixed = true;
                //animation duration
                $header.removeClass('affix');

                //TODO fix header wrapper height from small to large when page is scrolled (not top)
                setTimeout(function () {
                    //editing header wrapper height for smooth stick and unstick
                    $(".page_header_wrapper").css({height: $header.first().outerHeight()});
                    $header.addClass('affix');
                }, 250);
            }

            if (!affixed) {
                //editing header wrapper height for smooth stick and unstick
                $(".page_header_wrapper").css({height: $header.first().outerHeight()});
            }
        }

    });
//end of IIFE function
})(jQuery);
