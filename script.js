// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeBtn = document.querySelector('.close-btn');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, header');

// 1. Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeBtn.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// 3. Active Link Switching based on Scroll Position
window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 4. Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load in case elements are already in view
revealOnScroll();

// 5. Typing Effect for Hero Title
const typingTextElement = document.querySelector('.typing-text');
const wordsToType = ['Full Stack Developer', 'UI/UX Designer', 'Open Source Contributor', 'Tech Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length;
        typingSpeed = 500; // Pause before new word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect on load
setTimeout(typeEffect, 1000);

// 6. Form Submission Handling (Mock)
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Form Fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const serviceInput = document.getElementById('service');
        const messageInput = document.getElementById('message');
        const submitBtn = contactForm.querySelector('button');

        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            service: serviceInput.value,
            message: messageInput.value
        };

        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Success
                contactForm.reset();
                formMessage.innerHTML = '<span style="color: #10b981;"><i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.</span>';
            } else {
                // Backend Error
                formMessage.innerHTML = `<span style="color: #ef4444;"><i class="fas fa-exclamation-circle"></i> ${result.message || 'Error sending message.'}</span>`;
            }
        } catch (error) {
            // Network/Fetch Error
            console.error('Submission Error:', error);
            formMessage.innerHTML = '<span style="color: #ef4444;"><i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again.</span>';
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 5000);
        }
    });
}
// 7. Payment Modal Logic
const paymentModal = document.getElementById('paymentModal');
const openPaymentBtn = document.getElementById('openPaymentBtn');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const modalOverlay = document.getElementById('modalOverlay');
const copyUpiBtn = document.getElementById('copyUpiBtn');
const upiIdElement = document.getElementById('upiId');
const donePaymentBtn = document.getElementById('donePaymentBtn');
const razorpayBtn = document.getElementById('razorpayBtn');

if (openPaymentBtn && paymentModal) {
    // Open Modal
    openPaymentBtn.addEventListener('click', () => {
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close Modal
    const closeModal = () => {
        paymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closePaymentBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    donePaymentBtn.addEventListener('click', closeModal);

    // Razorpay Integration
    if (razorpayBtn) {
        razorpayBtn.addEventListener('click', async () => {
            try {
                razorpayBtn.disabled = true;
                razorpayBtn.innerHTML = 'Processing... <i class="fas fa-spinner fa-spin"></i>';

                // 1. Create Order on Backend
                const response = await fetch('/api/razorpay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: 500, // Fixed advance amount for now
                        currency: 'INR'
                    })
                });

                const order = await response.json();

                if (!order.id) throw new Error('Failed to create order');

                // 2. Open Razorpay Checkout
                const options = {
                    key: 'rzp_test_SJz1Fh6gtP2Szk', // Using provided test key
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Sabiyy Portfolio',
                    description: 'Project Advance Payment',
                    order_id: order.id,
                    handler: function (response) {
                        alert('Payment Successful! ID: ' + response.razorpay_payment_id);
                        closeModal();
                        window.location.href = '#contact';
                    },
                    prefill: {
                        name: document.getElementById('name')?.value || '',
                        email: document.getElementById('email')?.value || ''
                    },
                    theme: {
                        color: '#3b82f6'
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();

                rzp.on('payment.failed', function (response) {
                    alert('Payment Failed: ' + response.error.description);
                });

            } catch (error) {
                console.error('Payment Error:', error);
                alert('Something went wrong. Please try again or use the manual payment method.');
            } finally {
                razorpayBtn.disabled = false;
                razorpayBtn.innerHTML = 'Pay with Razorpay <i class="fas fa-credit-card"></i>';
            }
        });
    }

    // Copy UPI ID
    if (copyUpiBtn && upiIdElement) {
        copyUpiBtn.addEventListener('click', () => {
            const upiText = upiIdElement.textContent;
            navigator.clipboard.writeText(upiText).then(() => {
                // Visual feedback
                const originalIcon = copyUpiBtn.innerHTML;
                copyUpiBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyUpiBtn.style.color = '#10b981';

                setTimeout(() => {
                    copyUpiBtn.innerHTML = originalIcon;
                    copyUpiBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
}
