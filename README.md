project live link: https://rakibhjoy.github.io/Currency_Converter/
# 🌍 Modern Currency Converter

A beautiful, responsive, and feature-rich currency converter web application with real-time exchange rates powered by live API integration.

## ✨ Features

- **Real-time Exchange Rates**: Live currency conversion using the latest exchange rate API
- **Modern UI/UX**: Beautiful glassmorphism design with smooth animations
- **170+ Currencies**: Support for major and minor world currencies
- **Responsive Design**: Optimized for all devices and screen sizes
- **Auto-refresh**: Automatic rate updates every 10 minutes with smart caching
- **Interactive Elements**: 
  - Currency swap functionality
  - Clear amount button
  - Loading states with animations
  - Error handling with notifications
- **Live Updates**: Real-time "last updated" timestamps
- **Smooth Animations**: Value change animations and hover effects

## 🚀 Technologies Used

- **HTML5**: Semantic markup with modern structure
- **CSS3**: 
  - Flexbox and Grid layouts
  - CSS animations and transitions
  - Glassmorphism effects
  - Responsive design with media queries
  - Custom scrollbars
- **JavaScript (ES6+)**:
  - Async/await for API calls
  - Modern DOM manipulation
  - Event handling and debouncing
  - Error handling and user feedback
  - Animation frameworks

## 📱 API Integration

The application uses multiple reliable APIs for real-time exchange rates:

### Primary API: ExchangeRate-API
- Base URL: `https://api.exchangerate-api.com/v4/latest`
- Free tier with generous limits
- Automatic rate updates every 10 minutes
- Caching system for better performance

### Fallback API: Frankfurter API
- Used when primary API is unavailable
- Free and reliable alternative
- Automatic fallback handling

### Features:
- **Smart Caching**: Rates cached for 1 hour to reduce API calls
- **Automatic Fallback**: Seamless switch to backup API if needed
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during API calls

## 🎨 Design Features

### Visual Elements
- **Gradient Background**: Beautiful purple-blue gradient with floating animated shapes
- **Glassmorphism Cards**: Semi-transparent cards with backdrop blur effects
- **Smooth Animations**: Hover effects, transitions, and value change animations
- **Modern Typography**: Inter font family for clean, readable text
- **Flag Integration**: Country flags for each currency with automatic updates

### Interactive Components
- **Currency Selectors**: Dropdown menus with flag icons
- **Amount Input**: Number input with validation and clear functionality
- **Swap Button**: One-click currency swapping with rotation animation
- **Convert Button**: Primary action button with loading states
- **Result Display**: Large, prominent conversion results

## 📁 File Structure

```
Currency Converter/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # JavaScript functionality
├── codes.js            # Currency codes and country mappings
└── README.md           # Project documentation
```

## 🛠️ Setup and Usage

1. **Clone or Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Start Converting** - The app will automatically load with USD to INR conversion
4. **Customize** by selecting different currencies and amounts

### Browser Requirements
- Modern browser with ES6+ support
- Internet connection for API calls
- JavaScript enabled

## 🎯 Key Functionality

### Currency Conversion
- Enter any amount in the input field
- Select source and target currencies from dropdowns
- View real-time conversion results
- See current exchange rates

### User Experience
- **Auto-conversion**: Results update as you type (with debouncing)
- **Swap Currencies**: One-click button to swap source and target
- **Clear Amount**: Reset amount to 1 with clear button
- **Error Handling**: User-friendly error messages for API failures
- **Loading States**: Visual feedback during API calls

### Responsive Design
- **Desktop**: Full-featured layout with side-by-side currency selectors
- **Tablet**: Optimized layout with stacked elements
- **Mobile**: Touch-friendly interface with larger buttons

## 🔧 Customization

### Adding New Currencies
The `codes.js` file contains the currency-to-country mapping. To add new currencies:

```javascript
const countryList = {
  // ... existing currencies
  "NEW": "NC", // Add new currency code and country code
};
```

### Styling Modifications
- **Colors**: Modify CSS custom properties in `styles.css`
- **Animations**: Adjust timing and easing functions
- **Layout**: Modify flexbox/grid properties for different layouts

### API Configuration
- **Primary API**: Change `BASE_URL` in `script.js` for different primary APIs
- **Fallback API**: Modify `tryFallbackAPI()` function for different backup services
- **Update Frequency**: Modify intervals in `startAutoRefresh()` function
- **Cache Duration**: Adjust cache expiry time in `fetchExchangeRates()` function
- **Error Handling**: Customize error messages and retry logic

## 🌟 Performance Features

- **Debounced Input**: Prevents excessive API calls while typing
- **Smart Caching**: Stores rates for 1 hour to reduce API requests
- **Fallback System**: Automatic switch to backup API if primary fails
- **Optimized Animations**: Uses `requestAnimationFrame` for smooth animations
- **Lazy Loading**: Efficient DOM manipulation and event handling

## 🔒 Error Handling

- **Network Errors**: Graceful handling of API failures
- **Invalid Data**: Validation of API responses
- **User Feedback**: Clear error messages with auto-dismiss
- **Fallback Values**: Default to safe values when errors occur

## 📈 Future Enhancements

Potential improvements for the application:
- **Historical Data**: Charts showing rate trends over time
- **Offline Support**: Service worker for offline functionality
- **Multiple APIs**: Fallback API sources for reliability
- **User Preferences**: Save favorite currency pairs
- **Dark Mode**: Toggle between light and dark themes
- **Export Features**: Download conversion history

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for modern web development** 
