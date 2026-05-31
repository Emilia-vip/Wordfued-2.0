import { useState, type FormEvent } from 'react';

type SignupPageProps = {
	onSuccess?: () => void;
	onSignup?: (auth: { username: string; email: string }) => void;
};

export default function SignupPage({ onSuccess, onSignup }: SignupPageProps) {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, username, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setMessage(data.error ?? 'Något gick fel');
				return;
			}

			setMessage(`Konto skapat för ${data.email}. Gå till log in.`);
			onSignup?.({ username: data.username ?? '', email: data.email });
			onSuccess?.();
		} catch {
			setMessage('Kunde inte nå servern');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h1>Sign up</h1>

			<label>
				Email
				<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
			</label>

			<label>
				Username
				<input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
			</label>

			<label>
				Password
				<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
			</label>

			<button type="submit" disabled={loading}>
				{loading ? 'Creating...' : 'Create account'}
			</button>

			{message ? <p className="auth-message">{message}</p> : null}
		</form>
	);
}
