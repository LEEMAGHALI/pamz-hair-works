
import {useEffect,useState} from 'react';
import {Link,NavLink,Route,Routes,useNavigate} from 'react-router-dom';
import {
  ArrowRight, Menu, X, ShoppingBag, MapPin, Phone,
  Mail, Clock, Instagram, Facebook, Eye, EyeOff
} from 'lucide-react';
import { supabase } from './lib/supabase';



const fmt=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n||0));
const fallbackServices=[
 {id:'demo1',name:'Knotless Braids',description:'Lightweight braids with a neat, lasting finish.',price:120,duration_minutes:240,image_url:'/images/legacy/services/braids.png'},
 {id:'demo2',name:'Cornrows',description:'Clean parts and beautifully finished cornrow styles.',price:65,duration_minutes:120,image_url:'/images/legacy/services/cornrows.png'},
 {id:'demo3',name:'Wig Install',description:'A polished install, tailored to your look.',price:85,duration_minutes:150,image_url:'/images/legacy/services/wig.png'},
 {id:'demo4',name:'Wash and Treatment',description:'A nourishing reset for healthier-feeling hair.',price:45,duration_minutes:75,image_url:'/images/legacy/services/haircare.png'}
];
const fallbackProducts=[
 {id:'p1',name:'Atomy Herbal Shampoo',brand:'Atomy',description:'A salon-selected hair-care essential. Contact the salon for current pricing and availability.',price:null,image_url:'/images/legacy/products/shampoo.png'},
 {id:'p2',name:'Atomy Scalp Care Shampoo',brand:'Atomy',description:'A scalp-care essential selected by the salon. Contact the salon for current pricing and availability.',price:null,image_url:'/images/legacy/products/scalpcare.png'},
 {id:'p3',name:'Atomy Herbal Conditioner',brand:'Atomy',description:'A conditioning essential. Contact the salon for current pricing and availability.',price:null,image_url:'/images/legacy/products/conditioner.png'}
];

export default function App(){
 const [session,setSession]=useState(null),[profile,setProfile]=useState(null),[menu,setMenu]=useState(false);
 const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem('pamz-cart')||'[]')}catch{return[]}});
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:sub}=supabase.auth.onAuthStateChange((_,s)=>setSession(s));return()=>sub.subscription.unsubscribe()},[]);
 useEffect(()=>{if(!session?.user||!supabase){setProfile(null);return}supabase.from('profiles').select('*').eq('id',session.user.id).single().then(({data})=>setProfile(data))},[session]);
 useEffect(()=>localStorage.setItem('pamz-cart',JSON.stringify(cart)),[cart]);
 const add=p=>setCart(old=>{const x=old.find(i=>i.id===p.id);return x?old.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i):[...old,{...p,quantity:1}]});
 const logout=()=>supabase?.auth.signOut();
 return <div className="app"><div className="announcement">A little time for yourself. Beautiful hair, thoughtfully done. · Bolton, Lancashire</div>
 <header className="header"><Link to="/" className="brand-mark"><img src="/images/legacy/logo.jpg" alt="Pamz Hair Works logo"/><span>PAMZ <small>HAIR WORKS</small></span></Link><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button>
 <nav className={menu?'nav open':'nav'}><NavLink to="/" onClick={()=>setMenu(false)}>Home</NavLink><a href="/#services" onClick={()=>setMenu(false)}>Services</a><a href="/#gallery" onClick={()=>setMenu(false)}>Gallery</a><a href="/#shop" onClick={()=>setMenu(false)}>Shop</a><a href="/#contact" onClick={()=>setMenu(false)}>Contact</a>{session?<><Link to="/account">My account</Link>{profile?.role==='manager'&&<Link to="/manager">Dashboard</Link>}<button className="plain" onClick={logout}>Sign out</button></>:<Link to="/login">Sign in</Link>}<Link className="nav-cta" to="/book">Book an appointment <ArrowRight size={15}/></Link><Link to="/cart" className="bag"><ShoppingBag size={18}/><span>{cart.reduce((n,x)=>n+x.quantity,0)}</span></Link></nav></header>
 
<Routes>
  <Route path="/" element={<Home add={add} />} />
  <Route path="/login" element={<Auth />} />
  <Route path="/register" element={<Auth register />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/book" element={<Booking session={session} />} />
  <Route path="/account" element={<Account session={session} />} />
  <Route path="/cart" element={<Cart cart={cart} setCart={setCart} session={session} />} />
  <Route path="/manager" element={<Manager profile={profile} />} />
  <Route
    path="*"
    element={
      <main className="wrap section">
        <h1>Page not found</h1>
        <Link className="button" to="/">Back home</Link>
      </main>
    }
  />
</Routes>

 <footer className="footer"><div><Link to="/" className="brand-mark footer-brand"><img src="/images/legacy/logo.jpg" alt=""/><span>PAMZ <small>HAIR WORKS</small></span></Link><p>Professional hair, beauty and spa services in Bolton.</p><p>12 St Andrews Court, Shopping Arcade<br/>Bolton, Lancashire BL1 1LD</p></div><div className="foot-links"><a href="/#services">Services</a><a href="/#gallery">Gallery</a><a href="/#shop">Shop</a><Link to="/book">Book</Link><a href="/#contact">Contact</a></div><div className="footer-contact"><a href="tel:+447368420613">+44 7368 420613</a><a href="mailto:pamzhairworks@gmail.com">pamzhairworks@gmail.com</a><a href="https://www.instagram.com/pamzhairb" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.tiktok.com/@pamzhairworks" target="_blank" rel="noreferrer">TikTok</a></div><small className="copyright">© {new Date().getFullYear()} Pamz Hair Works. All rights reserved.</small></footer></div>
}

function Home({add}){
 const [services,setServices]=useState(fallbackServices),[products,setProducts]=useState(fallbackProducts);
 useEffect(()=>{if(!supabase)return;supabase.from('services').select('*').eq('active',true).order('name').then(({data,error})=>{if(!error)setServices(data||[])});supabase.from('products').select('*').eq('active',true).order('name').then(({data,error})=>{if(!error)setProducts(data||[])})},[]);
 const gallery=['client-01.jpg','client-02.jpg','client-03.jpg','client-04.jpg','client-06.jpg','client-07.jpg','client-08.jpg','client-09.jpg','client-10.jpg','client-11.jpg','client-12.jpg','client-13.jpg','client-14.jpg'];
 return <main><section className="hero"><div className="hero-copy"><p className="kicker">YOUR HAIR, OUR CRAFT · BOLTON</p><h1>Beautiful hair.<br/><em>Beautifully you.</em></h1><p className="lead">Professional hair, beauty and spa services in Bolton. We help you look and feel your best with expert styling, premium beauty treatments and exceptional customer care.</p><div className="hero-actions"><Link className="button" to="/book">Book your appointment <ArrowRight size={16}/></Link><a className="text-link" href="#services">Explore our services</a></div><p className="hours">Monday–Saturday · 9am–5pm · Sunday closed</p></div><div className="hero-visual"><img src="/images/legacy/hero.jpg" alt="The Pamz Hair Works salon in Bolton"/><div className="photo-note"><span>THE PAMZ EXPERIENCE</span><strong>Care in every detail.</strong></div></div></section>
 <section className="statement" id="about"><p>At Pamz Hair Works, your hair deserves time, attention and a finish you love. Come as you are and leave feeling your best.</p></section>
 <section className="wrap section" id="services"><div className="section-head"><div><p className="kicker">WHAT WE DO</p><h2>Made for your <em>next look.</em></h2><p className="sub">Hair, beauty and spa services tailored to your style.</p></div><Link className="text-link" to="/book">Explore booking <ArrowRight size={15}/></Link></div><div className="services">{services.map((s,i)=><article className="service" key={s.id}><span className="number">0{i+1}</span>{s.image_url&&<img className="service-image" src={s.image_url} alt={s.name} loading="lazy"/>}<h3>{s.name}</h3><p>{s.description||'A considered salon service, finished with care.'}</p><div className="service-meta"><b>{fmt(s.price)}</b><span>{s.duration_minutes||60} min</span></div><Link to="/book" className="service-link">Book this service <ArrowRight size={14}/></Link></article>)}</div></section>
 <section className="story"><div className="story-image"><img src="/images/legacy/about.jpg" alt="Pamz Hair Works salon interior and branding"/></div><div className="story-copy"><p className="kicker">A SALON EXPERIENCE WITH YOU IN MIND</p><h2>It’s more than a style. <em>It’s how you feel.</em></h2><p>Welcome to Pamz Hair Works Beauty Salon, where beauty, confidence and exceptional customer care come together. From braids and wig installations to hair treatments, makeup and relaxing beauty spa services, the team is committed to helping every client feel their best.</p><a className="button dark" href="#contact">Find the salon <ArrowRight size={16}/></a></div></section>
 <section className="wrap section" id="gallery"><div className="section-head"><div><p className="kicker">INSIDE PAMZ</p><h2>A look around <em>our salon.</em></h2><p className="sub">A few views of the space where we welcome you.</p></div></div><div className="salon-gallery">{gallery.map((file,i)=><img key={file} src={`/images/client-gallery/${file}`} alt={`Pamz Hair Works salon view ${i+1}`} loading="lazy"/>)}</div></section>
 <section className="wrap section" id="shop"><div className="section-head"><div><p className="kicker">THE HAIR CARE EDIT</p><h2>Good hair care, <em>at home.</em></h2><p className="sub">Shop selected Atomy and hair-care essentials. Contact the salon for current prices and availability.</p></div><span className="small-note">COLLECTION OR DELIVERY</span></div><div className="products">{products.map(p=><article className="product" key={p.id}><div className="product-img"><img src={p.image_url||'/images/legacy/products/shampoo.png'} alt={p.name}/></div><p className="product-brand">{p.brand||p.category||'PAMZ EDIT'}</p><h3>{p.name}</h3><p className="product-desc">{p.description}</p><div className="product-foot"><b>{p.price==null?'Ask for price':fmt(p.price)}</b>{p.price==null?<a className="product-enquire" href={`https://wa.me/447368420613?text=${encodeURIComponent(`Hello Pamz Hair Works, I would like to enquire about ${p.name}.`)}`} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={13}/></a>:<button onClick={()=>add(p)}>Add to bag <ShoppingBag size={14}/></button>}</div></article>)}</div></section>
 <section className="booking-banner"><p className="kicker">YOUR CHAIR IS WAITING</p><h2>Ready for your next <em>hair moment?</em></h2><p>Choose your service and request an appointment.</p><Link className="button pale" to="/book">Book an appointment <ArrowRight size={16}/></Link></section>
 <section className="contact-section" id="contact"><div className="wrap"><div className="section-head"><div><p className="kicker">COME AND SEE US</p><h2>Find <em>Pamz Hair Works.</em></h2><p className="sub">We look forward to welcoming you.</p></div></div><div className="contact-grid"><div className="contact-card"><MapPin/><div><h3>Visit the salon</h3><p>12 St Andrews Court<br/>Shopping Arcade<br/>Bolton, Lancashire<br/>BL1 1LD</p><a href="https://www.google.com/maps/search/?api=1&query=12+St+Andrews+Court+Shopping+Arcade+Bolton+BL1+1LD" target="_blank" rel="noreferrer">Get directions <ArrowRight size={13}/></a></div></div><div className="contact-card"><Phone/><div><h3>Call or WhatsApp</h3><p>+44 7368 420613</p><a href="https://wa.me/447368420613" target="_blank" rel="noreferrer">Message on WhatsApp <ArrowRight size={13}/></a></div></div><div className="contact-card"><Mail/><div><h3>Email</h3><p>pamzhairworks@gmail.com</p><a href="mailto:pamzhairworks@gmail.com">Send an email <ArrowRight size={13}/></a></div></div><div className="contact-card"><Clock/><div><h3>Opening hours</h3><p>Monday–Saturday<br/>9:00am–5:00pm<br/><strong>Sunday: Closed</strong></p></div></div></div><div className="social-row"><span>Follow Pamz</span><a href="https://www.instagram.com/pamzhairb/" target="_blank" rel="noreferrer"><Instagram size={17}/> Instagram</a><a href="https://www.facebook.com/share/14hhxfp5Pq5/?mibextid=wwXIfr" target="_blank" rel="noreferrer"><Facebook size={17}/> Facebook</a><a href="https://www.tiktok.com/@pamzhairworks" target="_blank" rel="noreferrer">TikTok <ArrowRight size={13}/></a></div></div></section>
 </main>
}



function Auth({ register = false }) {
  const [v, setV] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    if (!supabase) {
      setMsg('Supabase is not configured.');
      return;
    }

    setBusy(true);

    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(
          v.email,
          {
            redirectTo: `${window.location.origin}/reset-password`
          }
        );

        if (error) throw error;

        setMsg('Password reset instructions have been sent to your email. Check your inbox and spam folder.');
      } else if (register) {
        const { data, error } = await supabase.auth.signUp({
          email: v.email,
          password: v.password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: {
              full_name: v.name,
              phone: v.phone,
              address: v.address
            }
          }
        });

        if (error) throw error;

        setMsg(
          data.session
            ? 'Account created successfully!'
            : 'Account created. Please check your email to confirm your account.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: v.email,
          password: v.password
        });

        if (error) throw error;

        nav('/account');
      }
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="kicker">PAMZ HAIR WORKS</p>

        <h1>
          {forgot
            ? 'Reset your password'
            : register
              ? 'Create your account'
              : 'Welcome back.'}
        </h1>

        <p className="muted">
          {forgot
            ? 'Enter your registered email address and we will send you a password reset link.'
            : register
              ? 'Keep your appointments and details together.'
              : 'Sign in to manage your appointments.'}
        </p>

        <form className="form" onSubmit={submit}>
          {register && !forgot && (
            <>
              <label>
                Full name
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={v.name}
                  onChange={e => setV({ ...v, name: e.target.value })}
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+44..."
                  value={v.phone}
                  onChange={e => setV({ ...v, phone: e.target.value })}
                />
              </label>

              <label>
                Home address
                <textarea
                  required
                  rows="3"
                  autoComplete="street-address"
                  placeholder="House number, street, town and postcode"
                  value={v.address}
                  onChange={e => setV({ ...v, address: e.target.value })}
                />
              </label>
            </>
          )}

          <label>
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              value={v.email}
              onChange={e => setV({ ...v, email: e.target.value })}
            />
          </label>

          {!forgot && (
            <label>
              Password

              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength="8"
                  required
                  autoComplete={register ? 'new-password' : 'current-password'}
                  value={v.password}
                  onChange={e => setV({ ...v, password: e.target.value })}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>
          )}

          {!register && !forgot && (
            <div className="forgot-password">
              <button
                type="button"
                onClick={() => {
                  setForgot(true);
                  setMsg('');
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button className="button full" disabled={busy}>
            {busy
              ? 'Please wait...'
              : forgot
                ? 'Send reset link'
                : register
                  ? 'Create account'
                  : 'Sign in'}
          </button>
        </form>

        {msg && <p className="notice">{msg}</p>}

        <p className="switch">
          {forgot ? (
            <button
              type="button"
              onClick={() => {
                setForgot(false);
                setMsg('');
              }}
            >
              Back to sign in
            </button>
          ) : (
            <>
              {register ? 'Already have an account?' : 'New to Pamz?'}{' '}
              <Link to={register ? '/login' : '/register'}>
                {register ? 'Sign in' : 'Create an account'}
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}


function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    if (password.length < 8) {
      setMsg('Your password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMsg('Your passwords do not match.');
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({
      password
    });

    setBusy(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setUpdated(true);
    setMsg('Your password has been changed successfully.');
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="kicker">PAMZ HAIR WORKS</p>

        <h1>Choose a new password.</h1>

        <p className="muted">
          Enter your new password below to regain access to your account.
        </p>

        {updated ? (
          <>
            <p className="notice">{msg}</p>
            <Link className="button full" to="/login">
              Return to sign in
            </Link>
          </>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>
              New password

              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength="8"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <label>
              Confirm new password

              <input
                type="password"
                minLength="8"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </label>

            {msg && <p className="notice">{msg}</p>}

            <button className="button full" disabled={busy}>
              {busy ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}





function Booking({ session }) {
  const [services, setServices] = useState([]);
  const [styles, setStyles] = useState([]);
  const [service, setService] = useState('');
  const [style, setStyle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [slots, setSlots] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [busy, setBusy] = useState(false);

  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);

  const selected = services.find(s => s.id === service);

  // Use the visitor's local calendar date.
  const today = (() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  // Load active salon services and hairstyles.
  useEffect(() => {
    let active = true;

    async function loadServices() {
      if (!supabase) {
        setMsg('Supabase is not configured.');
        setLoadingServices(false);
        return;
      }

      const [serviceResult, styleResult] = await Promise.all([
        supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('name'),

        supabase
          .from('hairstyles')
          .select('*')
          .eq('active', true)
          .order('name')
      ]);

      if (!active) return;

      if (serviceResult.error) {
        setMsg(serviceResult.error.message);
      } else {
        setServices(serviceResult.data || []);
      }

      if (styleResult.error) {
        setMsg(styleResult.error.message);
      } else {
        setStyles(styleResult.data || []);
      }

      setLoadingServices(false);
    }

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  // Fetch available slots whenever the service or date changes.
  useEffect(() => {
    let active = true;

    setTime('');
    setSlots([]);

    if (!service || !date || !supabase) {
      setLoadingSlots(false);
      return;
    }

    async function loadSlots() {
      setLoadingSlots(true);
      setMsg('');

      const { data, error } = await supabase.rpc(
        'get_available_appointment_slots',
        {
          p_service_id: service,
          p_date: date
        }
      );

      if (!active) return;

      if (error) {
        setMsg(error.message);
        setSlots([]);
      } else {
        setSlots(data || []);
      }

      setLoadingSlots(false);
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [service, date]);

  async function submit(e) {
    e.preventDefault();
    setMsg('');

    if (!session) {
      setMsg('Please sign in before requesting an appointment.');
      return;
    }

    if (!selected || !date || !time) {
      setMsg('Please choose a service, date and available time.');
      return;
    }

    if (!slots.some(slot => slot.slot_time.slice(0, 5) === time)) {
      setMsg('This time is no longer available. Please select another time.');
      return;
    }

    setBusy(true);

    try {
      const { data, error } = await supabase.rpc(
        'create_appointment_request',
        {
          p_service_id: service,
          p_hairstyle_id: style || null,
          p_appointment_date: date,
          p_start_time: time,
          p_notes: notes
        }
      );

      if (error) throw error;

      setDone(true);
      setMsg(
        'Your appointment request has been received. The salon will review your request and confirm the next steps for your deposit.'
      );
    } catch (error) {
      setMsg(error.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return (
      <main className="wrap section narrow">
        <h1>Sign in before booking</h1>
        <p className="muted">
          Please sign in or create an account to request an appointment.
        </p>
        <Link className="button" to="/login">Sign in</Link>
      </main>
    );
  }

  if (done) {
    return (
      <main className="wrap section narrow">
        <div className="success">
          <p className="kicker">PAMZ HAIR WORKS</p>
          <h1>Your request has been received.</h1>
          <p>{msg}</p>
          <Link className="button" to="/account">
            View my account <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap section narrow">
      <p className="kicker">BOOK WITH PAMZ</p>

      <h1 className="page-title">
        Let's find your <em>next appointment.</em>
      </h1>

      <p className="muted">
        Choose your service, preferred date and an available appointment time.
        A 30% deposit is required to confirm a booking.
      </p>

      {loadingServices ? (
        <p className="muted">Loading salon services...</p>
      ) : services.length === 0 ? (
        <div className="notice">
          No active services are currently available. Please contact the salon.
        </div>
      ) : (
        <form className="form booking-form" onSubmit={submit}>
          <label>
            Service

            <select
              required
              value={service}
              onChange={e => setService(e.target.value)}
            >
              <option value="">Choose a service</option>

              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {fmt(s.price)}
                </option>
              ))}
            </select>
          </label>

          {styles.length > 0 && (
            <label>
              Hairstyle (optional)

              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
              >
                <option value="">Choose a hairstyle</option>

                {styles.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Preferred date

            <input
              type="date"
              min={today}
              required
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </label>

          <label>
            Available appointment times

            <select
              required
              value={time}
              disabled={!service || !date || loadingSlots || slots.length === 0}
              onChange={e => setTime(e.target.value)}
            >
              <option value="">
                {!service || !date
                  ? 'Choose a service and date first'
                  : loadingSlots
                    ? 'Checking availability...'
                    : slots.length === 0
                      ? 'No available times'
                      : 'Choose an available time'}
              </option>

              {slots.map(slot => {
                const value = slot.slot_time.slice(0, 5);

                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>

          {loadingSlots && (
            <p className="muted">Checking available appointments...</p>
          )}

          {service && date && !loadingSlots && slots.length === 0 && (
            <p className="muted">
              No appointment times are available for this service and date.
              Please try another date.
            </p>
          )}

          <label>
            Additional notes

            <textarea
              rows="4"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Anything we should know before your appointment?"
            />
          </label>

          {selected && (
            <div className="summary">
              <span>Service price</span>
              <b>{fmt(selected.price)}</b>

              <span>30% deposit</span>
              <b>{fmt(Number(selected.price) * 0.3)}</b>

              <span>Remaining balance</span>
              <b>{fmt(Number(selected.price) * 0.7)}</b>
            </div>
          )}

          {msg && <p className="notice">{msg}</p>}

          <button
            className="button full"
            disabled={busy || loadingSlots || !time || !selected}
          >
            {busy ? 'Submitting request...' : 'Request appointment'}
          </button>

          <small className="muted">
            Your appointment is not confirmed until the salon reviews
            your request and verifies the required deposit.
          </small>
        </form>
      )}
    </main>
  );
}



function Account({ session }) {
  const [rows, setRows] = useState([]);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!session || !supabase) return;

    async function loadAccount() {
      setLoading(true);

      const [profileResult, appointmentResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, phone, address')
          .eq('id', session.user.id)
          .single(),

        supabase
          .from('appointments')
          .select('*, services(name)')
          .eq('customer_id', session.user.id)
          .order('created_at', { ascending: false })
      ]);

      if (profileResult.error) {
        setMsg(profileResult.error.message);
      } else {
        setProfile({
          full_name: profileResult.data.full_name || '',
          phone: profileResult.data.phone || '',
          address: profileResult.data.address || ''
        });
      }

      if (appointmentResult.error) {
        setMsg(appointmentResult.error.message);
      } else {
        setRows(appointmentResult.data || []);
      }

      setLoading(false);
    }

    loadAccount();
  }, [session]);

  async function saveProfile(e) {
    e.preventDefault();
    setMsg('');
    setSuccess('');

    if (!profile.full_name.trim() || !profile.phone.trim() || !profile.address.trim()) {
      setMsg('Please complete all your personal details.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.rpc('update_my_profile', {
      p_full_name: profile.full_name.trim(),
      p_phone: profile.phone.trim(),
      p_address: profile.address.trim()
    });

    setSaving(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setEditing(false);
    setSuccess('Your profile has been updated successfully.');
  }

  if (!session) {
    return (
      <main className="wrap section narrow">
        <h1>Sign in to your account</h1>
        <Link className="button" to="/login">Sign in</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="wrap section narrow">
        <p className="muted">Loading your account...</p>
      </main>
    );
  }

  return (
    <main className="wrap section">
      <p className="kicker">YOUR PAMZ ACCOUNT</p>
      <h1 className="page-title">Your account.</h1>

      <section className="account-profile">
        <div className="section-head">
          <div>
            <p className="kicker">PERSONAL INFORMATION</p>
            <h2>Your <em>details.</em></h2>
            <p className="sub">Manage the information associated with your account.</p>
          </div>

          {!editing && (
            <button
              className="button"
              onClick={() => {
                setMsg('');
                setSuccess('');
                setEditing(true);
              }}
            >
              Edit details
            </button>
          )}
        </div>

        {editing ? (
          <form className="form" onSubmit={saveProfile}>
            <label>
              Full name
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                required
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />
            </label>

            <label>
              Home address
              <textarea
                rows="3"
                required
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={session.user.email || ''}
                disabled
              />
              <small className="muted">Your registered email cannot be changed here.</small>
            </label>

            {msg && <p className="notice">{msg}</p>}

            <div className="hero-actions">
              <button className="button" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>

              <button
                className="button dark"
                type="button"
                onClick={() => {
                  setEditing(false);
                  setMsg('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div>
              <span>Full name</span>
              <strong>{profile.full_name || 'Not provided'}</strong>
            </div>

            <div>
              <span>Email address</span>
              <strong>{session.user.email}</strong>
            </div>

            <div>
              <span>Phone number</span>
              <strong>{profile.phone || 'Not provided'}</strong>
            </div>

            <div>
              <span>Home address</span>
              <strong>{profile.address || 'Not provided'}</strong>
            </div>
          </div>
        )}

        {success && <p className="notice">{success}</p>}
      </section>

      <section className="account-appointments">
        <div className="section-head">
          <div>
            <p className="kicker">YOUR BOOKING HISTORY</p>
            <h2>Your <em>appointments.</em></h2>
          </div>

          <Link className="button" to="/book">
            Book again <ArrowRight size={15} />
          </Link>
        </div>

        {msg && !editing && <p className="notice">{msg}</p>}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Time</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(a => (
                <tr key={a.id}>
                  <td>{a.appointment_date}</td>
                  <td>{a.services?.name || 'Salon service'}</td>
                  <td>{String(a.start_time).slice(0, 5)}</td>
                  <td>{fmt(a.service_price)}</td>
                  <td>{a.status.replaceAll('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!rows.length && (
            <p className="empty">No appointments yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}


function Cart({cart,setCart,session}){
 const [msg,setMsg]=useState(''),total=cart.reduce((n,p)=>n+Number(p.price||0)*p.quantity,0);
 const change=(id,d)=>setCart(old=>old.map(p=>p.id===id?{...p,quantity:p.quantity+d}:p).filter(p=>p.quantity>0));
 return <main className="wrap section narrow"><p className="kicker">YOUR BAG</p><h1 className="page-title">A little something <em>for your hair.</em></h1>{cart.length?<><div className="cart-items">{cart.map(p=><div className="cart-item" key={p.id}><img src={p.image_url} alt=""/><div className="cart-info"><b>{p.name}</b><span>{fmt(p.price)}</span><div className="qty"><button onClick={()=>change(p.id,-1)}>-</button>{p.quantity}<button onClick={()=>change(p.id,1)}>+</button></div></div><b>{fmt(p.price*p.quantity)}</b></div>)}</div><div className="total"><span>Subtotal</span><b>{fmt(total)}</b></div><p className="muted">Collection or delivery will be selected at checkout.</p><button className="button full" onClick={()=>setMsg(session?'Worldpay checkout is not connected yet. Your bag is saved.':'Please sign in before checkout.')}>Continue to checkout</button>{msg&&<p className="notice">{msg}</p>}</>:<p className="empty">Your bag is empty. <Link to="/">Explore the shop</Link></p>}</main>
}


function Manager({ profile }) {
  const [tab, setTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-CA');

  async function refresh() {
    if (!supabase) return;
    setLoading(true);

    const [a, p, s] = await Promise.all([
      supabase.from('appointments')
        .select('*, profiles(full_name, phone), services(name)')
        .order('appointment_date', { ascending: true }),
      supabase.from('products').select('*').order('name'),
      supabase.from('services').select('*').order('name')
    ]);

    const error = a.error || p.error || s.error;
    setMsg(error?.message || '');
    setAppointments(a.data || []);
    setProducts(p.data || []);
    setServices(s.data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (profile?.role === 'manager') refresh();
  }, [profile]);

  async function updateStatus(id, value) {
    setMsg('');
    const { error } = await supabase.from('appointments')
      .update({ status: value }).eq('id', id);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg('Appointment status updated successfully.');
    refresh();
  }

  if (profile?.role !== 'manager') {
    return (
      <main className="wrap section narrow">
        <h1>Manager access only</h1>
        <p className="muted">Sign in with an authorised manager account.</p>
      </main>
    );
  }

  const pending = appointments.filter(a => a.status === 'pending_payment');
  const todaysAppointments = appointments.filter(
    a => a.appointment_date === today && a.status !== 'cancelled'
  );
  const upcoming = appointments.filter(
    a => a.appointment_date >= today &&
      !['cancelled', 'completed', 'no_show'].includes(a.status)
  );
  const activeProducts = products.filter(p => p.active);
  const activeServices = services.filter(s => s.active);

  return (
    <main className="wrap section manager-page">
      <div className="manager-heading">
        <div>
          <p className="kicker">PAMZ HAIR WORKS</p>
          <h1 className="page-title">Salon <em>dashboard.</em></h1>
          <p className="muted">Welcome to your salon management workspace.</p>
        </div>
        <button className="button" onClick={refresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh dashboard'}
        </button>
      </div>

      {msg && <p className="notice">{msg}</p>}

      <div className="manager-tabs">
        {[
          ['overview', 'Overview'],
          ['appointments', 'Appointments'],
          ['products', 'Products'],
          ['services', 'Services']
        ].map(([value, label]) => (
          <button key={value} className={tab === value ? 'active' : ''}
            onClick={() => setTab(value)}>
            {label}
            {value === 'appointments' && pending.length > 0 &&
              <span className="manager-count">{pending.length}</span>}
          </button>
        ))}
      </div>

      {loading ? <p className="muted">Loading salon information...</p> : (
        <>
          {tab === 'overview' && <>
            <div className="manager-stats">
              <article className="manager-stat"><span>Today's appointments</span><strong>{todaysAppointments.length}</strong><small>Scheduled for today</small></article>
              <article className="manager-stat"><span>Pending requests</span><strong>{pending.length}</strong><small>Awaiting review</small></article>
              <article className="manager-stat"><span>Total appointments</span><strong>{appointments.length}</strong><small>All recorded bookings</small></article>
              <article className="manager-stat"><span>Active services</span><strong>{activeServices.length}</strong><small>Available to customers</small></article>
              <article className="manager-stat"><span>Active products</span><strong>{activeProducts.length}</strong><small>Available in the shop</small></article>
            </div>

            <section className="manager-panel">
              <div className="section-head">
                <div><p className="kicker">SALON SCHEDULE</p><h2>Upcoming <em>appointments.</em></h2></div>
                <button className="text-link" onClick={() => setTab('appointments')}>View all appointments <ArrowRight size={15}/></button>
              </div>
              {upcoming.length === 0 ? <p className="empty">No upcoming appointments at the moment.</p> : (
                <div className="table-scroll"><table>
                  <thead><tr><th>Date</th><th>Customer</th><th>Service</th><th>Time</th><th>Status</th></tr></thead>
                  <tbody>{upcoming.slice(0, 8).map(a => <tr key={a.id}>
                    <td>{a.appointment_date}</td>
                    <td>{a.profiles?.full_name || 'Customer'}<small>{a.profiles?.phone}</small></td>
                    <td>{a.services?.name || 'Salon service'}</td>
                    <td>{String(a.start_time).slice(0, 5)}</td>
                    <td>{a.status.replaceAll('_', ' ')}</td>
                  </tr>)}</tbody>
                </table></div>
              )}
            </section>

            <section className="manager-panel">
              <p className="kicker">NEEDS YOUR ATTENTION</p><h2>Pending <em>requests.</em></h2>
              {pending.length === 0 ? <p className="empty">You're all caught up. No pending requests.</p> : (
                <div className="table-scroll"><table>
                  <thead><tr><th>Customer</th><th>Date</th><th>Service</th><th>Price</th><th>Action</th></tr></thead>
                  <tbody>{pending.slice(0, 5).map(a => <tr key={a.id}>
                    <td>{a.profiles?.full_name || 'Customer'}</td><td>{a.appointment_date}</td>
                    <td>{a.services?.name || 'Salon service'}</td><td>{fmt(a.service_price)}</td>
                    <td><button className="text-link" onClick={() => setTab('appointments')}>Review</button></td>
                  </tr>)}</tbody>
                </table></div>
              )}
            </section>
          </>}

          {tab === 'appointments' && <section className="manager-panel">
            <p className="kicker">BOOKING MANAGEMENT</p><h2>All <em>appointments.</em></h2>
            <div className="table-scroll"><table>
              <thead><tr><th>Date</th><th>Customer</th><th>Service</th><th>Price</th><th>Deposit</th><th>Status</th></tr></thead>
              <tbody>{appointments.map(a => <tr key={a.id}>
                <td>{a.appointment_date}<small>{String(a.start_time).slice(0, 5)}</small></td>
                <td>{a.profiles?.full_name || 'Customer'}<small>{a.profiles?.phone}</small></td>
                <td>{a.services?.name || 'Salon service'}</td><td>{fmt(a.service_price)}</td><td>{fmt(a.deposit_amount)}</td>
                <td><select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
                  {['pending_payment', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'].map(status =>
                    <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                </select></td>
              </tr>)}</tbody>
            </table>{appointments.length === 0 && <p className="empty">No appointments recorded yet.</p>}</div>
          </section>}

          {tab === 'products' && <CatalogManager type="products" rows={products} onSaved={refresh} />}
          {tab === 'services' && <CatalogManager type="services" rows={services} onSaved={refresh} />}
        </>
      )}
    </main>
  );
}

function CatalogManager({ type, rows, onSaved }) {
  const isProduct = type === 'products';
  const emptyForm = {
    name: '', description: '', price: '', active: true, image_url: '',
    ...(isProduct
      ? { brand: '', category: '', stock_quantity: 0 }
      : { duration_minutes: 60 })
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const title = isProduct ? 'product' : 'service';

  useEffect(() => {
    if (!imageFile) {
      setPreview(form.image_url || '');
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, form.image_url]);

  function startAdd() {
    setForm({ ...emptyForm });
    setImageFile(null);
    setEditingId(null);
    setMsg('');
    setShowForm(true);
  }

  function startEdit(item) {
    setForm({
      ...emptyForm,
      ...item,
      price: item.price ?? '',
      image_url: item.image_url || '',
      stock_quantity: item.stock_quantity ?? 0,
      duration_minutes: item.duration_minutes ?? 60
    });
    setImageFile(null);
    setEditingId(item.id);
    setMsg('');
    setShowForm(true);
  }

  async function uploadImage(file) {
    if (!file) return form.image_url || null;
    if (!file.type.startsWith('image/')) throw new Error('Please select an image file.');
    if (file.size > 5 * 1024 * 1024) throw new Error('Please choose an image smaller than 5 MB.');

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const filePath = `${type}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('salon-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('salon-images').getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function save(e) {
    e.preventDefault();
    setMsg('');

    if (!form.name.trim()) return setMsg('Please enter a name.');
    if (form.price === '' || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      return setMsg('Please enter a valid price.');
    }

    if (!isProduct && (!Number(form.duration_minutes) || Number(form.duration_minutes) <= 0)) {
      return setMsg('Please enter a valid service duration.');
    }

    setSaving(true);
    try {
      const imageUrl = await uploadImage(imageFile);
      const payload = {
        name: form.name.trim(),
        description: (form.description || '').trim(),
        price: Number(form.price),
        active: Boolean(form.active),
        image_url: imageUrl
      };

      if (isProduct) {
        payload.brand = (form.brand || '').trim();
        payload.category = (form.category || '').trim();
        payload.stock_quantity = Math.max(0, Number(form.stock_quantity) || 0);
      } else {
        payload.duration_minutes = Number(form.duration_minutes);
      }

      const result = editingId
        ? await supabase.from(type).update(payload).eq('id', editingId)
        : await supabase.from(type).insert(payload);
      if (result.error) throw result.error;

      setShowForm(false);
      setEditingId(null);
      setImageFile(null);
      setForm({ ...emptyForm });
      setMsg(`${isProduct ? 'Product' : 'Service'} saved successfully.`);
      await onSaved();
    } catch (error) {
      setMsg(error.message || 'Unable to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item) {
    setMsg('');
    const { error } = await supabase.from(type)
      .update({ active: !item.active }).eq('id', item.id);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg(`${item.name} is now ${item.active ? 'hidden' : 'active'}.`);
    await onSaved();
  }

  return (
    <section className="manager-panel">
      <div className="section-head">
        <div>
          <p className="kicker">{isProduct ? 'SHOP MANAGEMENT' : 'SERVICE MANAGEMENT'}</p>
          <h2>Salon <em>{isProduct ? 'products.' : 'services.'}</em></h2>
          <p className="muted">Add photos, edit details and manage what customers see.</p>
        </div>
        <button className="button" onClick={startAdd}>Add {title}</button>
      </div>

      {msg && <p className="notice">{msg}</p>}

      {showForm && <form className="form catalog-form" onSubmit={save}>
        <h3>{editingId ? `Edit ${title}` : `Add a new ${title}`}</h3>
        <label>Name<input required value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder={isProduct ? 'e.g. Atomy Herbal Shampoo' : 'e.g. Knotless Braids'} /></label>
        <label>Description<textarea rows="3" value={form.description || ''}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Write a short description..." /></label>
        <label>Price (£)<input type="number" min="0" step="0.01" required value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} /></label>

        {isProduct ? <>
          <label>Brand<input value={form.brand || ''}
            onChange={e => setForm({ ...form, brand: e.target.value })} /></label>
          <label>Category<input value={form.category || ''}
            onChange={e => setForm({ ...form, category: e.target.value })} /></label>
          <label>Stock quantity<input type="number" min="0" step="1" value={form.stock_quantity}
            onChange={e => setForm({ ...form, stock_quantity: e.target.value })} /></label>
        </> : <label>Duration (minutes)<input type="number" min="1" step="1" required
          value={form.duration_minutes}
          onChange={e => setForm({ ...form, duration_minutes: e.target.value })} /></label>}

        <label>Photo
          <input type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] || null)} />
          <small className="muted">Choose a JPG, PNG or WebP image up to 5 MB.</small>
        </label>
        {preview && <div className="catalog-image-preview">
          <img src={preview} alt={`${title} preview`} />
          <button type="button" className="text-link"
            onClick={() => { setImageFile(null); setForm({ ...form, image_url: '' }); setPreview(''); }}>
            Remove photo
          </button>
        </div>}

        <label className="catalog-active"><input type="checkbox" checked={Boolean(form.active)}
          onChange={e => setForm({ ...form, active: e.target.checked })} />Visible to customers</label>
        <div className="hero-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Save changes' : `Add ${title}`}
          </button>
          <button className="button dark" type="button" disabled={saving}
            onClick={() => { setShowForm(false); setEditingId(null); setImageFile(null); setMsg(''); }}>
            Cancel
          </button>
        </div>
      </form>}

      <div className="table-scroll"><table>
        <thead><tr><th>Photo</th><th>Name</th>{isProduct && <th>Brand</th>}<th>Price</th>
          <th>{isProduct ? 'Stock' : 'Duration'}</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{rows.map(item => <tr key={item.id}>
          <td>{item.image_url ? <img className="catalog-thumb" src={item.image_url} alt={item.name} /> : '—'}</td>
          <td>{item.name}</td>{isProduct && <td>{item.brand || '—'}</td>}
          <td>{fmt(item.price)}</td><td>{isProduct ? item.stock_quantity ?? 0 : `${item.duration_minutes} min`}</td>
          <td>{item.active ? 'Active' : 'Hidden'}</td>
          <td><div className="catalog-actions">
            <button type="button" className="text-link" onClick={() => startEdit(item)}>Edit</button>
            <button type="button" className="text-link" onClick={() => toggleActive(item)}>{item.active ? 'Hide' : 'Activate'}</button>
          </div></td>
        </tr>)}</tbody>
      </table>
      {rows.length === 0 && <p className="empty">No {isProduct ? 'products' : 'services'} added yet. Use the button above to add your first one.</p>}</div>
    </section>
  );
}
