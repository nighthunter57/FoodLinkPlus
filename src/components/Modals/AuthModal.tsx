import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, continueAsGuest } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const success = await signIn(email, password);
      if (success) {
        toast({ title: "Signed in successfully" });
        onClose();
      } else {
        toast({ title: "Invalid credentials", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Sign in failed", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const success = await signUp(name, email, password);
      if (success) {
        toast({ title: "Account created successfully" });
        onClose();
      } else {
        toast({ title: "Sign up failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Sign up failed", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleGuestContinue = async () => {
    setLoading(true);
    try {
      const success = await continueAsGuest(phone);
      if (success) {
        toast({ title: "Phone verified - you can now continue as guest" });
        onClose();
      } else {
        toast({ title: "Phone verification failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Verification failed", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {mode === 'signin' && 'Sign in to continue'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'guest' && 'Continue as Guest'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {mode === 'signin' && (
            <>
              <p className="text-sm text-muted-foreground">
                Please sign in to complete your reservation and payment. You can create an account or continue as a guest with phone verification.
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleSignIn} disabled={loading} className="w-full">
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => setMode('signup')} className="w-full">
                  Create Account
                </Button>
                <Button variant="link" onClick={() => setMode('guest')} className="w-full text-sm">
                  Continue as Guest
                </Button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleSignUp} disabled={loading} className="w-full">
                  Create Account
                </Button>
                <Button variant="outline" onClick={() => setMode('signin')} className="w-full">
                  Back to Sign In
                </Button>
              </div>
            </>
          )}

          {mode === 'guest' && (
            <>
              <p className="text-sm text-muted-foreground">
                Enter your phone number for verification. You'll receive a one-time code before pickup.
              </p>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleGuestContinue} disabled={loading} className="w-full">
                  Continue as Guest
                </Button>
                <Button variant="outline" onClick={() => setMode('signin')} className="w-full">
                  Back to Sign In
                </Button>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-border">
            <Button variant="link" className="w-full text-sm" onClick={() => window.open('/restaurant', '_blank')}>
              Restaurant / Company Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;