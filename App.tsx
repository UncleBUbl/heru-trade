import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Coins, Trees, Map as MapIcon, User as UserIcon, ArrowRight, Globe, Fingerprint, ShieldCheck, History, Menu, X, Zap } from 'lucide-react';
import HeruEye from './components/HeruEye';
import ForestMap from './components/ForestMap';
import ParticleEffect from './components/ParticleEffect';
import { ViewState, User, Transaction, Network } from './types';
import { MOCK_RATES, INITIAL_TRANSACTIONS } from './constants';
import { generateForestStory, analyzeTransactionImpact } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>(ViewState.ONBOARDING);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<'USDC' | 'cUSD'>('USDC');
  const [isLoading, setIsLoading] = useState(false);
  const [forestStory, setForestStory] = useState<string>('');
  const [successTx, setSuccessTx] = useState<Transaction | null>(null);
  const [isBlackFalcon, setIsBlackFalcon] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Simulate syncing currency rates
    const interval = setInterval(() => {
      // In a real app, fetch Chainlink oracles here
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view === ViewState.FOREST && user) {
       generateForestStory(transactions).then(setForestStory);
    }
  }, [view, user, transactions]);

  // --- Handlers ---

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate Smart Wallet Passkey Auth
    setTimeout(() => {
      setUser({
        id: 'u1',
        username: 'heru_builder',
        balanceUSDC: 450.00,
        balanceCelo: 120.00,
        treesPlanted: 12,
        isBlackFalconMode: false
      });
      setIsLoading(false);
      setView(ViewState.HOME);
    }, 1500);
  };

  const handleSend = async () => {
    setView(ViewState.CONFIRM);
  };

  const handleConfirmTransaction = async () => {
    setIsLoading(true);
    // Simulate Blockchain txn on Base/Celo
    setTimeout(async () => {
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        recipient: recipient,
        amount: parseFloat(amount),
        currency: selectedCurrency,
        timestamp: Date.now(),
        treeSpecies: 'Shea Butter Tree',
        treeCoords: { lat: 9.0820, lng: 8.6753 },
        carbonOffsetKg: 25,
        imageUrl: `https://picsum.photos/400/400?random=${Date.now()}`
      };
      
      setTransactions([newTx, ...transactions]);
      if (user) {
        setUser({ ...user, treesPlanted: user.treesPlanted + 1, balanceUSDC: user.balanceUSDC - parseFloat(amount) });
      }
      
      setSuccessTx(newTx);
      setIsLoading(false);
      setView(ViewState.SUCCESS);
      
      // Pre-fetch AI explanation
      await analyzeTransactionImpact(newTx);
    }, 2000);
  };

  // --- Render Helpers ---

  const renderOnboarding = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen bg-black text-center px-6"
    >
      <div className="mb-12">
        <HeruEye size="lg" onClick={handleLogin} />
      </div>
      <h1 className="text-4xl md:text-6xl font-royal text-heru-gold mb-4 tracking-wider">HERU TRADE</h1>
      <p className="text-gray-400 font-display text-sm tracking-widest mb-12">SOVEREIGN AFRICAN MONEY</p>
      
      <button 
        onClick={handleLogin}
        className="flex items-center gap-3 bg-heru-gold/10 border border-heru-gold text-heru-gold px-8 py-4 rounded-full font-bold hover:bg-heru-gold hover:text-black transition-all active:scale-95"
      >
        {isLoading ? (
            <span className="animate-pulse">AUTHENTICATING...</span>
        ) : (
            <>
                <Scan className="w-5 h-5" />
                <span>ACCESS WALLET</span>
            </>
        )}
      </button>
      <p className="mt-4 text-xs text-gray-600 flex items-center gap-2">
        <Fingerprint className="w-3 h-3" /> Secured by FaceID & Passkeys
      </p>
    </motion.div>
  );

  const renderHome = () => (
    <div className="pt-24 pb-32 px-6 max-w-lg mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
           <h2 className="text-gray-400 text-sm font-display tracking-wider">TOTAL BALANCE</h2>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-bold font-royal text-white">$</span>
             <span className="text-5xl font-bold font-royal text-white">
                {((user?.balanceUSDC || 0) + (user?.balanceCelo || 0)).toFixed(2)}
             </span>
           </div>
        </div>
        <div className="w-12 h-12 rounded-full border border-heru-gold/30 overflow-hidden" onClick={() => setView(ViewState.SETTINGS)}>
            <img src="https://picsum.photos/id/1005/200/200" alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Action Eye */}
      <div className="flex justify-center mb-16">
        <div className="relative">
            <HeruEye size="lg" onClick={() => setView(ViewState.SEND)} />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-heru-gold font-display tracking-[0.3em] text-xs animate-pulse whitespace-nowrap">
                TAP TO SEND
            </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <h3 className="text-heru-gold font-display text-sm">RECENT TRANSMISSIONS</h3>
            <button className="text-xs text-gray-500">VIEW ALL</button>
        </div>
        {transactions.slice(0, 3).map(tx => (
            <div key={tx.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="bg-heru-green/20 p-2 rounded-full text-heru-green">
                        <Trees className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{tx.recipient}</p>
                        <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white font-mono">-${tx.amount.toFixed(2)}</p>
                    <p className="text-xs text-heru-gold">{tx.treeSpecies}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );

  const renderSend = () => (
    <div className="pt-20 px-6 max-w-lg mx-auto h-full flex flex-col">
      <h2 className="text-heru-gold font-royal text-2xl mb-8 text-center">INITIATE TRANSFER</h2>
      
      <div className="bg-heru-void border border-heru-gold/20 rounded-2xl p-6 mb-6">
        <label className="text-xs text-gray-400 font-display mb-2 block">AMOUNT (USD)</label>
        <div className="flex items-center gap-2 border-b border-heru-gold/50 pb-2 mb-6">
            <span className="text-2xl text-heru-gold">$</span>
            <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-4xl text-white w-full outline-none font-royal placeholder-gray-700"
                autoFocus
            />
        </div>

        <label className="text-xs text-gray-400 font-display mb-2 block">LOCAL PREVIEW</label>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {MOCK_RATES.map(rate => (
                <div key={rate.code} className="flex-shrink-0 bg-white/5 px-3 py-1 rounded-md">
                    <span className="text-gray-400 text-xs mr-1">{rate.code}</span>
                    <span className="text-white font-mono text-sm">
                        {amount ? (parseFloat(amount) * rate.rate).toLocaleString() : '0'}
                    </span>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-heru-void border border-heru-gold/20 rounded-2xl p-6 mb-8">
        <label className="text-xs text-gray-400 font-display mb-2 block">RECIPIENT</label>
        <input 
            type="text" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@username or Phone"
            className="bg-transparent border-b border-white/20 w-full py-2 text-lg text-white outline-none focus:border-heru-gold transition-colors"
        />
      </div>

      <div className="mt-auto mb-24">
        <button 
            onClick={handleSend}
            disabled={!amount || !recipient}
            className="w-full bg-heru-gold text-black font-bold font-display py-4 rounded-xl disabled:opacity-50 hover:bg-white transition-colors flex items-center justify-center gap-2"
        >
            REVIEW <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderConfirm = () => (
    <div className="flex flex-col h-full pt-20 px-6 max-w-lg mx-auto">
         <h2 className="text-white font-royal text-xl mb-12 text-center">CONFIRM SACRED TRANSFER</h2>
         
         <div className="bg-gradient-to-b from-heru-gold/10 to-transparent p-8 rounded-3xl border border-heru-gold/30 flex flex-col items-center mb-8">
            <div className="text-gray-400 text-sm mb-1">SENDING</div>
            <div className="text-4xl font-royal text-white mb-4">${parseFloat(amount).toFixed(2)}</div>
            <ArrowRight className="text-heru-gold mb-4 rotate-90" />
            <div className="text-gray-400 text-sm mb-1">TO</div>
            <div className="text-xl font-bold text-white">{recipient}</div>
         </div>

         <div className="space-y-4 mb-12">
             <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Network Cost</span>
                 <span className="text-heru-green">FREE (Subsidy Active)</span>
             </div>
             <div className="flex justify-between text-sm">
                 <span className="text-gray-400">Eco-Impact</span>
                 <span className="text-heru-gold flex items-center gap-1"><Trees className="w-3 h-3"/> +1 Tree (Toucan Protocol)</span>
             </div>
         </div>

         <button 
            onClick={handleConfirmTransaction}
            className="w-full relative overflow-hidden group bg-heru-void border border-heru-gold text-heru-gold py-5 rounded-xl font-bold tracking-widest"
         >
            {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-heru-gold border-t-transparent rounded-full animate-spin"></div>
                    PROCESSING
                </div>
            ) : (
                <div className="flex items-center justify-center gap-3">
                    <Fingerprint className="w-6 h-6" />
                    <span>HOLD TO SIGN</span>
                </div>
            )}
         </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 relative">
        <ParticleEffect />
        <div className="mb-8 animate-bounce text-heru-gold">
            <Trees size={64} />
        </div>
        <h2 className="text-3xl font-royal text-white mb-2">TRANSFER COMPLETE</h2>
        <p className="text-heru-gold mb-8 font-display tracking-widest">FOREST EXPANDED</p>
        
        {successTx && (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-xs w-full mb-8 backdrop-blur-md">
                <div className="h-40 w-full bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                    <img src={successTx.imageUrl} alt="Satellite" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 text-[10px] text-white rounded">
                        LAT: {successTx.treeCoords.lat.toFixed(4)}
                    </div>
                </div>
                <div className="flex justify-between items-center text-left">
                    <div>
                        <p className="text-xs text-gray-400">SPECIES</p>
                        <p className="text-white font-bold">{successTx.treeSpecies}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">OFFSET</p>
                        <p className="text-heru-green font-bold">{successTx.carbonOffsetKg}kg CO2</p>
                    </div>
                </div>
            </div>
        )}

        <button 
            onClick={() => setView(ViewState.HOME)}
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-heru-gold transition-colors"
        >
            RETURN HOME
        </button>
    </div>
  );

  const renderForest = () => (
    <div className="pt-20 px-6 pb-32 max-w-lg mx-auto">
        <h2 className="text-heru-gold font-royal text-2xl mb-2">MY FOREST</h2>
        <p className="text-gray-400 text-xs mb-6 font-display">
           {user?.treesPlanted} TREES PLANTED • {((user?.treesPlanted || 0) * 25)}KG CO2 SEQUESTERED
        </p>

        {/* AI Story Card */}
        <div className="bg-gradient-to-br from-heru-gold/20 to-heru-earth/10 border border-heru-gold/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Zap className="text-heru-gold" />
            </div>
            <p className="text-heru-gold font-royal text-sm italic leading-relaxed">
                "{forestStory || 'Consulting the Oracle...'}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-heru-gold/60 uppercase tracking-widest">
                <div className="w-2 h-2 bg-heru-gold rounded-full animate-pulse"></div>
                Spirit of Heru
            </div>
        </div>

        {/* Grid of Trees */}
        <div className="grid grid-cols-2 gap-4">
            {transactions.map(tx => (
                <div key={tx.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 group">
                    <div className="h-32 bg-gray-800 relative">
                        <img src={tx.imageUrl} alt="Tree" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-heru-gold/10 mix-blend-overlay"></div>
                    </div>
                    <div className="p-3">
                        <p className="text-xs text-white font-bold truncate">{tx.treeSpecies}</p>
                        <p className="text-[10px] text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pt-24 px-6 max-w-lg mx-auto flex flex-col items-center">
        <h2 className="text-heru-gold font-royal text-2xl mb-8 tracking-widest">IDENTITY</h2>
        
        <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-2 border-heru-gold p-1">
                <img src="https://picsum.photos/id/1005/400/400" alt="User" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute bottom-0 right-0 bg-heru-gold text-black p-2 rounded-full border-4 border-black">
                <UserIcon className="w-4 h-4" />
            </div>
        </div>

        <h3 className="text-2xl text-white font-display mb-1">@{user?.username || 'Heru Initiate'}</h3>
        <p className="text-gray-500 text-xs tracking-[0.2em] mb-12">ID: {user?.id?.toUpperCase() || 'Unknown'}</p>

        <div className="w-full space-y-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-heru-gold w-5 h-5" />
                    <span className="text-sm text-white font-display">Black Falcon Mode</span>
                </div>
                <button 
                    onClick={() => setIsBlackFalcon(!isBlackFalcon)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isBlackFalcon ? 'bg-heru-gold' : 'bg-gray-800'}`}
                >
                    <div className={`w-4 h-4 bg-black rounded-full shadow-md transition-transform duration-300 ${isBlackFalcon ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
            
             <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center opacity-50">
                <div className="flex items-center gap-3">
                    <Zap className="text-gray-400 w-5 h-5" />
                    <span className="text-sm text-gray-400 font-display">Guardians (Coming Soon)</span>
                </div>
            </div>

            <button 
                onClick={() => { setUser(null); setView(ViewState.ONBOARDING); }}
                className="w-full mt-8 border border-red-500/30 text-red-500 py-4 rounded-xl font-display text-sm hover:bg-red-500/10 transition-colors"
            >
                DISCONNECT PASSKEY
            </button>
        </div>
    </div>
  );

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-2xl border-t border-white/10 pb-8 pt-4 z-50">
        <div className="max-w-lg mx-auto flex justify-between items-end px-6">
            {/* Left Group */}
            <button 
                onClick={() => setView(ViewState.HOME)} 
                className={`flex flex-col items-center gap-1.5 w-14 group ${view === ViewState.HOME ? 'text-heru-gold' : 'text-gray-500'}`}
            >
                <Coins className="w-6 h-6 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-display tracking-widest opacity-80">HOME</span>
            </button>
            
            <button 
                onClick={() => setView(ViewState.FOREST)} 
                className={`flex flex-col items-center gap-1.5 w-14 group ${view === ViewState.FOREST ? 'text-heru-gold' : 'text-gray-500'}`}
            >
                <Trees className="w-6 h-6 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-display tracking-widest opacity-80">FOREST</span>
            </button>

            {/* Center FAB */}
            <div className="relative -top-8">
                <button 
                    onClick={() => setView(ViewState.SEND)}
                    className="group relative"
                >
                     <div className={`
                        w-16 h-16 rounded-full bg-heru-black border border-heru-gold flex items-center justify-center 
                        shadow-[0_0_20px_rgba(230,184,0,0.3)] 
                        ${view === ViewState.SEND ? 'ring-2 ring-heru-gold ring-offset-4 ring-offset-black shadow-[0_0_30px_rgba(230,184,0,0.6)]' : ''}
                        transition-all duration-300 group-hover:scale-105
                    `}>
                        <Scan className={`w-7 h-7 text-heru-gold ${view === ViewState.SEND ? 'animate-pulse' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Right Group */}
            <button 
                onClick={() => setView(ViewState.MAP)} 
                className={`flex flex-col items-center gap-1.5 w-14 group ${view === ViewState.MAP ? 'text-heru-gold' : 'text-gray-500'}`}
            >
                <Globe className="w-6 h-6 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-display tracking-widest opacity-80">MAP</span>
            </button>

            <button 
                onClick={() => setView(ViewState.SETTINGS)} 
                className={`flex flex-col items-center gap-1.5 w-14 group ${view === ViewState.SETTINGS ? 'text-heru-gold' : 'text-gray-500'}`}
            >
                <UserIcon className="w-6 h-6 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <span className="text-[9px] font-display tracking-widest opacity-80">ME</span>
            </button>
        </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isBlackFalcon ? 'grayscale contrast-125' : ''} bg-black text-white selection:bg-heru-gold selection:text-black overflow-hidden relative`}>
      {/* Top Bar */}
      {view !== ViewState.ONBOARDING && (
          <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center max-w-lg mx-auto bg-gradient-to-b from-black to-transparent">
             <div className="font-royal text-heru-gold text-xl tracking-widest">HERU</div>
             <div className="flex gap-4">
                 <button onClick={() => setIsBlackFalcon(!isBlackFalcon)} className="text-gray-500 hover:text-white">
                     <ShieldCheck className={`w-5 h-5 ${isBlackFalcon ? 'text-red-500' : ''}`} />
                 </button>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             </div>
          </div>
      )}

      <AnimatePresence mode='wait'>
        <motion.main 
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            {view === ViewState.ONBOARDING && renderOnboarding()}
            {view === ViewState.HOME && renderHome()}
            {view === ViewState.SEND && renderSend()}
            {view === ViewState.CONFIRM && renderConfirm()}
            {view === ViewState.SUCCESS && renderSuccess()}
            {view === ViewState.FOREST && renderForest()}
            {view === ViewState.MAP && <ForestMap />}
            {view === ViewState.SETTINGS && renderSettings()}
        </motion.main>
      </AnimatePresence>

      {view !== ViewState.ONBOARDING && view !== ViewState.SUCCESS && <NavBar />}

      {/* Footer */}
      <footer className="fixed bottom-2 right-4 text-[9px] text-gray-700 z-10 pointer-events-none mix-blend-difference hidden md:block">
        © 2025 Heru Trade™ – Sovereign African Money
      </footer>
    </div>
  );
};

export default App;