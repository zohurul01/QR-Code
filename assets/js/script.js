// DOM Elements
const typeButtons = document.querySelectorAll('.tab-button');
const dynamicFields = document.getElementById("dynamicFields");
const generateBtn = document.getElementById("generateBtn");
const qrPreview = document.getElementById("qrPreview");
const qrColor = document.getElementById("qrColor");
const qrBGColor = document.getElementById("qrBGColor");
const qrLogo = document.getElementById("qrLogo");
const downloadButtons = document.querySelectorAll('.download-btn');

// Input templates for each QR type
const inputFields = {
    text: `<div class="input-group"><label for="text">Type Your Text:</label><textarea id="text" required></textarea></div>`,
    url: `<div class="input-group"><label for="url">URL:</label><input type="url" id="url" required /></div>`,
    phone: `<div class="input-group"><label for="phone">Phone Number:</label><input type="tel" id="phone" required /></div>`,
    email: `<div class="input-group"><label for="email">Email:</label><input type="email" id="email" required /></div>`,
    whatsapp: `<div class="input-group"><label for="whatsapp">WhatsApp Number:</label><input type="tel" id="whatsapp" required /></div>`,
    vcard: `
        <div class="input-group"><label for="vFirstName">First Name:</label><input type="text" id="vFirstName" required /></div>
        <div class="input-group"><label for="vLastName">Last Name:</label><input type="text" id="vLastName" /></div>
        <div class="input-group"><label for="vPhone">Phone:</label><input type="tel" id="vPhone" required /></div>
        <div class="input-group"><label for="vEmail">Email:</label><input type="email" id="vEmail" required /></div>
        <div class="input-group"><label for="vAddress">Address:</label><input type="text" id="vAddress" /></div>
    `,
    wifi: `
        <div class="input-group"><label for="wifiSSID">Wi-Fi SSID:</label><input type="text" id="wifiSSID" required /></div>
        <div class="input-group"><label for="wifiPassword">Password:</label><input type="password" id="wifiPassword" required /></div>
        <div class="input-group"><label for="wifiEncryption">Encryption:</label>
        <select id="wifiEncryption">
            <option value="WPA">WPA</option>
            <option value="WEP">WEP</option>
            <option value="WPA2-EAP">WPA/WPA2</option>
            <option value="">None</option>
        </select></div>
    `,
    sms: `
        <div class="input-group"><label for="smsNumber">Phone Number:</label><input type="tel" id="smsNumber" required /></div>
        <div class="input-group"><label for="smsMessage">Message:</label><textarea id="smsMessage"></textarea></div>
    `,
};

// QRCodeStyling instance (global)
let qrCode;

// Switch active tab and update input fields
const handleTabSwitch = (button) => {
    typeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    const selectedType = button.getAttribute('data-type');
    dynamicFields.innerHTML = inputFields[selectedType] || '';
};

// Fetch data based on the selected QR type
const getQRData = (type) => {
    const dataFetchers = {
        text: () => document.getElementById('text')?.value || '',
        url: () => document.getElementById('url')?.value || '',
        phone: () => document.getElementById('phone')?.value || '',
        email: () => document.getElementById('email')?.value || '',
        whatsapp: () => document.getElementById('whatsapp')?.value || '',
        vcard: () => {
            const firstName = document.getElementById('vFirstName')?.value || '';
            const lastName = document.getElementById('vLastName')?.value || '';
            const phone = document.getElementById('vPhone')?.value || '';
            const email = document.getElementById('vEmail')?.value || '';
            const address = document.getElementById('vAddress')?.value || '';
            return `BEGIN:VCARD\nVERSION:3.0 \nN:${lastName};${firstName}\nTEL:${phone}\nEMAIL:${email}\nADR:${address}\nEND:VCARD`;
        },
        wifi: () => `WIFI:S:${document.getElementById('wifiSSID')?.value || ''};T:${document.getElementById('wifiEncryption')?.value || ''};P:${document.getElementById('wifiPassword')?.value || ''};;`,
        sms: () => `SMSTO:${document.getElementById('smsNumber')?.value || ''}:${document.getElementById('smsMessage')?.value || ''}`,
    };
    return dataFetchers[type]?.() || '';
};

// Initialize Color Pickers
const initializeColorPicker = (elementId, defaultColor, onSave) => {
    return Pickr.create({
        el: elementId,
        theme: 'nano',
        default: defaultColor,
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                rgba: true,
                input: true,
                save: true
            }
        }
    }).on('save', onSave);
};

// Initialize QR Code Color Picker
const qrColorPicker = initializeColorPicker('#qrColorPicker', '#000000', (color) => {
    qrColor.value = color.toHEXA().toString();
});

// Initialize Background Color Picker
const qrBGColorPicker = initializeColorPicker('#qrBGColorPicker', '#FFFFFF', (color) => {
    qrBGColor.value = color.toHEXA().toString();
});


// Helper to load image
const loadImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Function to get the selected dot style
const getSelectedDotStyle = () => {
    const selectedDot = document.querySelector('input[name="dotStyle"]:checked');
    return selectedDot ? selectedDot.value : 'square'; // Default to 'square'
};

// Generate QR code
const generateQRCode = async () => {
    const selectedType = document.querySelector('.tab-button.selected')?.getAttribute('data-type');
    const data = getQRData(selectedType);
    const dotStyle = getSelectedDotStyle();
    const inputs = document.querySelectorAll('#dynamicFields input, #dynamicFields textarea, #dynamicFields select');
    let isValid = true;

    // Clear previous error messages
    inputs.forEach(input => {
        const error = input.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.remove();
        }
    });

    // Validate inputs
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required.';
            input.insertAdjacentElement('afterend', errorMessage);
        }
    });

    if (!isValid) return;

    if (!data) {
        alert("Please enter data to generate a QR code.");
        return;
    }

    qrPreview.innerHTML = '';

    // Options for QRCodeStyling
    const options = {
        // width: 200,
        // height: 200,
        data,
        dotsOptions: {
            color: qrColor.value,
            type: dotStyle // Dot type based on user selection
        },
        backgroundOptions: {
            color: qrBGColor.value || '#ffffff',
        },
    };


    const logoFile = qrLogo.files[0];
    if (logoFile) {
        options.image = await loadImage(logoFile);
        options.imageOptions = {
            margin: 10,
            width: 50,
            height: 50,
            crossOrigin: "anonymous",
        };
    }

    qrCode = new QRCodeStyling(options);
    qrCode.append(qrPreview);
};


// Download QR code
const downloadQRCode = (format) => {
    if (!qrCode) return;

    const validFormats = ['png', 'jpg', 'svg'];
    if (!validFormats.includes(format)) {
        console.error("Invalid format specified:", format);
        return;
    }

    qrCode.download({ name: "QRCode", extension: format });
};

// Event Listeners
typeButtons.forEach(button => button.addEventListener('click', () => handleTabSwitch(button)));
generateBtn.addEventListener('click', generateQRCode);
downloadButtons.forEach(button => {
    button.addEventListener('click', () => {
        const format = button.getAttribute('data-format');
        downloadQRCode(format);
    });
});

// Initialize with the first tab selected
typeButtons[0]?.click();