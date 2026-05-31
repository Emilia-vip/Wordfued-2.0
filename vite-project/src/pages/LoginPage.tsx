import { useState, type FormEvent } from 'react';

type LoginPageProps = {
	onLogin?: (auth: { token: string; username: string }) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setMessage('');

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setMessage(data.error ?? 'Något gick fel');
				return;
			}

			localStorage.setItem('token', data.token);
			localStorage.setItem('username', data.username);
			onLogin?.({ token: data.token, username: data.username });
			setMessage('Inloggad!');
		} catch {
			setMessage('Kunde inte nå servern');
		} finally {
			setLoading(false);
		}
	}

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<h1>Log in</h1>

			<label>
				Email
				<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
			</label>

			<label>
				Password
				<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
			</label>

			<button type="submit" disabled={loading}>
				{loading ? 'Logging in...' : 'Log in'}
			</button>

			{message ? <p className="auth-message">{message}</p> : null}
		</form>
	);
}
