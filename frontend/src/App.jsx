import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

// Components
import HeaderBar from './components/HeaderBar';
import BottomNav from './components/BottomNav';

// Screens
import SplashScreen from './screens/01_SplashScreen';
import LoginScreen from './screens/02_LoginScreen';
import OtpScreen from './screens/03_OtpScreen';
import LanguageScreen from './screens/04_LanguageScreen';
import LocationScreen from './screens/05_LocationScreen';
import HomeScreen from './screens/06_HomeScreen';
import CropJourneyScreen from './screens/07_CropJourneyScreen';
import CropMemoryScreen from './screens/08_CropMemoryScreen';
import ProblemSolverScreen from './screens/09_ProblemSolverScreen';
import DiagnosisResultScreen from './screens/10_DiagnosisResultScreen';
import WeatherForecastScreen from './screens/11_WeatherForecastScreen';
import MandiPricesScreen from './screens/12_MandiPricesScreen';
import ExpertEscalationScreen from './screens/13_ExpertEscalationScreen';
import FarmerProfileScreen from './screens/14_FarmerProfileScreen';
import AdminLoginScreen from './screens/15_AdminLoginScreen';
import AdminDashboardScreen from './screens/16_AdminDashboardScreen';

export default function App() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { t } = useLanguage();

  // Navigation State
  const [currentStep, setCurrentStep] = useState('splash'); // 'splash' | 'login' | 'otp' | 'lang_select' | 'loc_select' | 'main' | 'admin_login'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'journey' | 'solver' | 'memory' | 'weather' | 'market'
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Splash completed
  const handleSplashDone = () => {
    if (isAuthenticated) {
      if (isAdmin) {
        setCurrentStep('admin_dashboard');
      } else {
        setCurrentStep('main');
      }
    } else {
      setCurrentStep('login');
    }
  };

  // Login -> OTP
  const handleOtpRequested = (identifier) => {
    setLoginIdentifier(identifier);
    setCurrentStep('otp');
  };

  // OTP Verified -> Language check or Main
  const handleOtpVerified = () => {
    setCurrentStep('lang_select');
  };

  // Language Selected -> Location check
  const handleLanguageSelected = () => {
    if (showLanguageModal) {
      setShowLanguageModal(false);
    } else {
      setCurrentStep('loc_select');
    }
  };

  // Location Completed -> Enter main app
  const handleLocationCompleted = () => {
    setCurrentStep('main');
    setActiveTab('home');
  };

  // Handle Diagnosis Complete
  const handleDiagnosed = (diagnosis) => {
    setCurrentDiagnosis(diagnosis);
  };

  // Admin login flow
  const handleAdminLoggedIn = () => {
    setCurrentStep('admin_dashboard');
  };

  // Render Auth & Setup Flows
  if (currentStep === 'splash') {
    return <SplashScreen onStart={handleSplashDone} />;
  }

  if (currentStep === 'login') {
    return (
      <LoginScreen
        onOtpRequested={handleOtpRequested}
        onAdminLoginClick={() => setCurrentStep('admin_login')}
      />
    );
  }

  if (currentStep === 'otp') {
    return (
      <OtpScreen
        identifier={loginIdentifier}
        onVerified={handleOtpVerified}
        onBack={() => setCurrentStep('login')}
      />
    );
  }

  if (currentStep === 'lang_select' || showLanguageModal) {
    return (
      <LanguageScreen
        onLanguageSelected={handleLanguageSelected}
      />
    );
  }

  if (currentStep === 'loc_select') {
    return (
      <LocationScreen
        onLocationCompleted={handleLocationCompleted}
      />
    );
  }

  if (currentStep === 'admin_login') {
    return (
      <AdminLoginScreen
        onBack={() => setCurrentStep('login')}
        onAdminLoggedIn={handleAdminLoggedIn}
      />
    );
  }

  if (currentStep === 'admin_dashboard') {
    return (
      <div className="app-container">
        <AdminDashboardScreen onBack={() => setCurrentStep('main')} />
      </div>
    );
  }

  // Profile overlay screen
  if (showProfile) {
    return (
      <div className="app-container">
        <FarmerProfileScreen
          onBack={() => setShowProfile(false)}
          onChangeLangClick={() => setShowLanguageModal(true)}
        />
      </div>
    );
  }

  // Active Main App Layout
  return (
    <div className="app-container">
      <HeaderBar
        title="AgriSathi"
        onLanguageClick={() => setShowLanguageModal(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <main className="min-h-[calc(100vh-4rem)]">
        {activeTab === 'home' && (
          <HomeScreen
            onNavigate={(tab) => {
              if (tab === 'escalation') setActiveTab('solver_escalate');
              else setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'journey' && (
          <CropJourneyScreen
            onStartNewCrop={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'solver' && (
          currentDiagnosis ? (
            <DiagnosisResultScreen
              diagnosis={currentDiagnosis}
              onBack={() => setCurrentDiagnosis(null)}
              onEscalateClick={() => setActiveTab('solver_escalate')}
            />
          ) : (
            <ProblemSolverScreen
              onDiagnosed={handleDiagnosed}
              onEscalateClick={() => setActiveTab('solver_escalate')}
            />
          )
        )}

        {activeTab === 'memory' && (
          <CropMemoryScreen />
        )}

        {activeTab === 'weather' && (
          <WeatherForecastScreen onBack={() => setActiveTab('home')} />
        )}

        {activeTab === 'market' && (
          <MandiPricesScreen onBack={() => setActiveTab('home')} />
        )}

        {activeTab === 'solver_escalate' && (
          <ExpertEscalationScreen onBack={() => setActiveTab('solver')} />
        )}
      </main>

      <BottomNav
        activeTab={activeTab === 'solver_escalate' ? 'solver' : activeTab}
        onSelectTab={(tab) => {
          setCurrentDiagnosis(null);
          setActiveTab(tab);
        }}
      />
    </div>
  );
}
