import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo.png"
            alt="Rania Logo"
            className={props.className}
        />
    );
}
