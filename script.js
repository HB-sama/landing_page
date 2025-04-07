document.addEventListener('DOMContentLoaded', function() {
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
            console.log('Données du formulaire:', formData);
            
            // Affichage d'un message de confirmation
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            
            // Réinitialisation du formulaire
            contactForm.reset();
        });
    }
    
    // Smooth scrolling pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajustement pour le header fixe
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation au scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialisation des styles pour l'animation
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Écouteur d'événement pour le scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Appel initial pour vérifier les éléments visibles au chargement
    animateOnScroll();

    const form = document.getElementById('eligibility-form');
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    // Fonction de réinitialisation du formulaire
    function resetForm() {
        // Réinitialiser l'étape courante
        currentStep = 0;
        
        // Réinitialiser tous les champs du formulaire
        if (form) {
            form.reset();
        }
        
        // Cacher toutes les étapes sauf la première
        steps.forEach((step, index) => {
            if (index === 0) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });
        
        // Réinitialiser la barre de progression
        if (progressBar) {
            progressBar.style.width = '5%';
        }
        
        // Réinitialiser le pourcentage affiché
        const percentageElement = document.querySelector('.step-percentage');
        if (percentageElement) {
            percentageElement.textContent = '5%';
        }
    }

    // Appeler la réinitialisation au chargement de la page
    resetForm();

    // Réinitialiser quand l'utilisateur quitte la page
    window.addEventListener('beforeunload', function() {
        resetForm();
    });

    // Gestion des boutons suivant/précédent
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                nextStep();
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            prevStep();
        });
    });

    // Gestion de la soumission du formulaire
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep(currentStep)) {
                const formData = new FormData(form);
                
                // Vérification de l'éligibilité
                if (formData.get('statut') === 'locataire' || 
                    formData.get('type_logement') === 'appartement') {
                    showErrorStep();
                } else {
                    submitForm(formData);
                }
            }
        });
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        
        // Mise à jour de la barre de progression
        const progress = ((stepIndex + 1) / steps.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Mise à jour du pourcentage
        const percentageElement = document.querySelector('.step-percentage');
        if (percentageElement) {
            percentageElement.textContent = `${Math.round(progress)}%`;
        }
    }

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    }

    function validateStep(stepIndex) {
        const currentStepElement = steps[stepIndex];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    function showErrorStep() {
        const errorStep = document.querySelector('.error-step');
        if (errorStep) {
            steps.forEach(step => step.style.display = 'none');
            errorStep.style.display = 'block';
        }
    }

    async function submitForm(formData) {
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Afficher le message de succès
                const finalStep = document.querySelector('.final-step');
                if (finalStep) {
                    steps.forEach(step => step.style.display = 'none');
                    finalStep.style.display = 'block';
                }
            } else {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.');
        }
    }
}); 