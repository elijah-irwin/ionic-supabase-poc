// React.
import { FormEvent, useEffect, useState } from 'react';

// Ionic.
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonText,
  IonToolbar,
  IonLoading,
  useIonToast,
} from '@ionic/react';

// DB.
import { supabase } from '../lib/supabase';

// Contexts.
import { useAuthContext } from '../contexts/AuthContext';

/****************************************
 * - Account Page -
 ***************************************/
export function AccountPage() {
  const session = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showToast] = useIonToast();

  const [profile, setProfile] = useState({
    username: '',
    website: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (session) {
      console.log(session);
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setIsLoading(true);
      if (!session?.user) throw new Error('No user on the session');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile({
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile(e: FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session.user.id,
        ...profile,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
    } catch (error: any) {
      showToast({ message: error.message, duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  }

  // Render.
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={updateProfile}>
          <IonItem>
            <IonLabel>
              <p>Email</p>
              <p>{session?.user?.email}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel position='stacked'>Name</IonLabel>
            <IonInput
              type='text'
              name='username'
              value={profile.username}
              onIonChange={e =>
                setProfile({ ...profile, username: e.detail.value ?? '' })
              }></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position='stacked'>Website</IonLabel>
            <IonInput
              type='url'
              name='website'
              value={profile.website}
              onIonChange={e =>
                setProfile({ ...profile, website: e.detail.value ?? '' })
              }></IonInput>
          </IonItem>
          <div className='ion-text-center'>
            <IonButton fill='clear' type='submit'>
              Update Profile
            </IonButton>
          </div>
        </form>

        <div className='ion-text-center'>
          <IonButton fill='clear' onClick={() => supabase.auth.signOut()}>
            Log Out
          </IonButton>
        </div>

        <div>
          <IonText>Current loading status: {isLoading ? 'true' : 'false'}</IonText>
        </div>
      </IonContent>

      <IonLoading isOpen={isLoading} />
    </IonPage>
  );
}
