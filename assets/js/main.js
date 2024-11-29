/**
 * Template Name: QR Code Generator - v1.0
 * Template URL: https://zohirs.com
 * Author: Zohir
 */

// Preloader
$(window).on('load', function () {
    "use strict";
    const preloader = $('#preloader'),
        loader = preloader.find('#loading');
    loader.fadeOut();
    preloader.delay(400).fadeOut('slow');
});

$(document).ready(function () {
    "use strict";

    /*----------------------------------------------------*/
    /*  Navigation Menu Toggle
    /*----------------------------------------------------*/
    const hamburger = document.querySelector(".hamburger"),
        navMenu = document.querySelector(".navbar"),
        navMenuOverlay = document.querySelector(".nav-overlay");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            navMenuOverlay.classList.toggle("active");
        });
        document.querySelectorAll(".dropdown-menu").forEach((link) =>
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                navMenuOverlay.classList.remove("active");
            })
        );
    }

    /*----------------------------------------------------*/
    /*  Smooth Scroll with Offset for Fixed Menu
    /*----------------------------------------------------*/
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.getBoundingClientRect().top + window.scrollY - 90,
                    behavior: 'smooth'
                });
            }, 200);
        }
    }

    /*----------------------------------------------------*/
    /*  Footer Year Display
    /*----------------------------------------------------*/
    // document.getElementById("year").textContent = new Date().getFullYear();


    /*----------------------------------------------------*/
    /*  Bootstrap Form Validation
    /*----------------------------------------------------*/
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });


});

/*----------------------------------------------------*/
/*  Sticky Header and Back-to-Top Button
/*----------------------------------------------------*/
$(window).on('scroll', function () {
    "use strict";
    const scrollY = $(window).scrollTop();
    if (scrollY > 80) {
        $(".main-header").addClass("fixd");
        $(".back-to-top").addClass("active");
    } else {
        $(".main-header").removeClass("fixd");
        $(".back-to-top").removeClass("active");
    }
});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  