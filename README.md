# 🌍 AkquaintX Survey Flow

**Professional Survey Flow Management with RLMV Pricing**

A sophisticated React-TypeScript application for configuring and managing complex survey flows with geography-based targeting, category-specific screening, and dynamic RLMV (Relative Labour Market Value) pricing.

![TypeScript](https://img.shields.io/badge/TypeScript-85.2%25-blue)
![CSS](https://img.shields.io/badge/CSS-13.2%25-purple)
![HTML](https://img.shields.io/badge/HTML-1.6%25-orange)

## 🚀 Live Demo

🔗 **[View Live Application](https://surveyflow-one.vercel.app)**

## ✨ Features

### 🎯 **Smart Survey Configuration**
- **Landing Page**: Professional welcome interface with feature highlights
- **RLMV Pricing Calculator**: Dynamic pricing based on geography, seniority, and company size
- **Multi-Geography Support**: 8 global markets with salary ratio adjustments
- **Category Targeting**: Professional demographics across multiple industries
- **Automatic Requirement Detection**: Intelligently determines survey complexity

### 💰 **Advanced RLMV Pricing Model**
- **Geography-Based Multipliers**: US base (1.0x) with regional salary adjustments
- **Seniority Levels**: Entry Level (1.5x) to CXO (4.5x) multipliers
- **Company Size Scaling**: Small (1x) to Enterprise (1.6x) adjustments
- **Professional Premium**: 1.5x for non-US markets
- **Service Charges**: 20% AkquaintX service fee calculation

### 🔗 **Intelligent Live Link Generation**
- **Pattern-Based Routing**: Single, geo-based, category-based, or geo-category-based
- **Dynamic URL Generation**: Automatic link creation based on configuration
- **Individual Link Management**: Pause, edit, or stop specific links
- **Real-time Performance Tracking**: Click and completion statistics

### 📊 **Comprehensive Survey Management**
- **Flow Monitoring**: Real-time survey status and performance metrics
- **Response Distribution**: Visual breakdown by geography and category
- **Requirement 3 Alerts**: Special handling for complex multi-geo/multi-category scenarios
- **Mock Analytics**: Simulated response data for demonstration

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: React Context + useReducer
- **Build Tool**: Create React App
- **Deployment**: Vercel
- **Version Control**: Git + GitHub

## 🏗️ Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx          # Welcome page with CTA
│   ├── PaymentConfiguration.tsx  # RLMV pricing calculator
│   ├── LiveLinksGeneration.tsx  # Link generation & management
│   ├── FlowActive.tsx           # Survey monitoring dashboard
│   └── ...
├── context/
│   └── SurveyFlowContext.tsx    # Global state management
├── types/
│   └── survey.ts                # TypeScript interfaces
└── App.css                      # Global styles
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jtthachil/surveyflow.git
   cd surveyflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs development server on port 3000 |
| `npm test` | Launches test runner in watch mode |
| `npm run build` | Creates production build in `build/` |
| `npm run eject` | Ejects from Create React App (⚠️ irreversible) |

## 🌍 Supported Geographies

| Country | Code | Salary Ratio | Professional Premium |
|---------|------|--------------|---------------------|
| United States | US | 1.0x (base) | 1.0x |
| United Kingdom | UK | 0.85x | 1.5x |
| Canada | CA | 0.75x | 1.5x |
| Australia | AU | 0.80x | 1.5x |
| Germany | DE | 0.70x | 1.5x |
| France | FR | 0.65x | 1.5x |
| Japan | JP | 0.60x | 1.5x |
| Brazil | BR | 0.25x | 1.5x |

## 🎯 Survey Flow Types

### Requirement 1: Single Geography, Single Category
- **Pattern**: Single live link
- **Use Case**: Simple, focused surveys
- **Example**: US Technology professionals only

### Requirement 2: Multiple Geographies, Single Category  
- **Pattern**: Geography-based links
- **Use Case**: Multi-market, single focus
- **Example**: US + UK Marketing professionals

### Requirement 3: Multiple Geographies, Multiple Categories
- **Pattern**: Geography-category combination links
- **Use Case**: Complex, comprehensive surveys
- **Example**: US + UK across Technology + Marketing + Sales
- **⚠️ Special Features**: Potential scenario alerts and mock distribution view

### Requirement 4: Single Geography, Multiple Categories
- **Pattern**: Category-based links  
- **Use Case**: Single market, multi-demographic
- **Example**: US across multiple professional categories

## 💡 Key Features Explained

### RLMV Pricing Formula
```
Final Price = US Base × Geography Ratio × Professional Premium × Seniority × Company Size × LOI
```

### Live Link Patterns
- **Single**: `survey.com/live/single?aqx_id=[id]`
- **Geo-based**: `survey.com/live/geo/{CODE}?aqx_id=[id]`
- **Category-based**: `survey.com/live/category/{ID}?aqx_id=[id]`
- **Geo-Category**: `survey.com/live/geo/{CODE}/cat/{ID}?aqx_id=[id]`

## 🎨 Design Highlights

- **Modern UI**: Gradient backgrounds, glass morphism effects
- **Responsive Design**: Mobile-first approach with breakpoints
- **Interactive Elements**: Hover animations, smooth transitions
- **Professional Branding**: AkquaintX color scheme and typography
- **Accessibility**: Semantic HTML, proper contrast ratios

## 🔄 Application Flow

1. **Landing Page** → Welcome + Start Configuration
2. **Payment Configuration** → RLMV pricing setup
3. **Redirect Links** → External survey platform links
4. **Live Links Generation** → Dynamic URL creation
5. **Screener Configuration** → Participant filtering
6. **Participant Selection** → Target audience
7. **Flow Review** → Final configuration check
8. **Flow Active** → Live survey management

## 🚀 Deployment

The application is automatically deployed to Vercel on every push to the main branch.

**Live URL**: https://surveyflow-one.vercel.app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Joseph Thomas Thachil**
- GitHub: [@jtthachil](https://github.com/jtthachil)
- LinkedIn: [Joseph Thomas Thachil](https://linkedin.com/in/josephthomasthachil)

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript for type safety
- Vercel for seamless deployment
- Create React App for the foundation

---

**Built with ❤️ for professional survey management**
