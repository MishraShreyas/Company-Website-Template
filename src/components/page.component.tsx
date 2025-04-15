interface PageProps {
	children: React.ReactNode;
}

export function Page({ children }: PageProps) {
	return (
		<>
			<h1>Page</h1>
			{children}
		</>
	);
}
