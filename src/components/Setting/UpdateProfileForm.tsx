import { useEffect, useState } from 'preact/hooks';
import { TOKEN_COOKIE_NAME } from '../../lib/utils';
import Cookies from 'js-cookie';

export default function UpdateProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setIsLoading(true);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append(
      'Cookie',
      `${TOKEN_COOKIE_NAME}=${Cookies.get(TOKEN_COOKIE_NAME)}`
    );

    fetch('http://localhost:8080/v1-update-profile', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({
        name,
        github: github === '' ? undefined : github,
        linkedin: linkedin === '' ? undefined : linkedin,
        website: website === '' ? undefined : website,
      }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          return json;
        } else {
          throw new Error(json.message);
        }
      })
      .then((data) => {
        setIsLoading(false);
        setName(data.name);
        setEmail(data.email);
        const { github, linkedin, website } = data.links;
        setGithub(github);
        setLinkedin(linkedin);
        setWebsite(website);
        setSuccessMessage('Profile updated successfully');
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  };

  // Make a request to the backend to fill in the form with the current values
  useEffect(() => {
    async function fetchProfile() {
      // Set the loading state
      setIsLoading(true);

      // Create headers with the cookie
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append(
        'Cookie',
        `${TOKEN_COOKIE_NAME}=${Cookies.get(TOKEN_COOKIE_NAME)}`
      );

      try {
        const res = await fetch('http://localhost:8080/v1-me', {
          method: 'POST',
          credentials: 'include',
          headers,
        });

        const json = await res.json();
        if (res.ok) {
          setName(json.name);
          setEmail(json.email);

          if (json.links) {
            const { github, linkedin, website } = json.links;
            setGithub(github);
            setLinkedin(linkedin);
            setWebsite(website);
          }
        } else {
          throw new Error(json.message);
        }
      } catch (error: any) {
        setError(error?.message || 'Something went wrong');
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold sm:text-4xl">Update Profile</h2>
      <p className="mt-2">Manage settings for your roadmap.sh profile</p>
      <div className="mt-8 space-y-4">
        <div className="flex w-full flex-col">
          <label
            for="name"
            className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-2 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition duration-150 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex w-full flex-col">
          <label
            for="email"
            className='text-sm leading-none text-slate-500 after:text-red-400 after:content-["*"]'
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-2 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition duration-150 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            required
            disabled
            placeholder="john@example.com"
            value={email}
          />
        </div>

        <div className="flex w-full flex-col">
          <label for="github" className="text-sm leading-none text-slate-500">
            Github
          </label>
          <input
            type="text"
            name="github"
            id="github"
            className="mt-2 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition duration-150 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://github.com/username"
            value={github}
            onChange={(e) => setGithub((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="flex w-full flex-col">
          <label for="linkedin" className="text-sm leading-none text-slate-500">
            LinkedIn
          </label>
          <input
            type="text"
            name="linkedin"
            id="linkedin"
            className="mt-2 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition duration-150 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://www.linkedin.com/in/username/"
            value={linkedin}
            onChange={(e) => setLinkedin((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="flex w-full flex-col">
          <label for="website" className="text-sm leading-none text-slate-500">
            Website
          </label>
          <input
            type="text"
            name="website"
            id="website"
            className="mt-2 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none transition duration-150 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite((e.target as HTMLInputElement).value)}
          />
        </div>

        {error && (
          <div className="text-sm font-medium text-red-500">
            <span className="text-red-500">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="text-sm font-medium text-green-500">
            <span className="text-green-500">{successMessage}</span>
          </div>
        )}

        <button
          className="!mt-5 inline-flex h-10 min-w-[120px] items-center justify-center rounded-lg border border-slate-300 bg-black p-2 px-4 text-sm font-medium text-white outline-none transition duration-150 ease-in-out focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              class={`h-5 w-5 animate-spin text-white`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="stroke-[4px] opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Update'
          )}
        </button>
      </div>
    </form>
  );
}
