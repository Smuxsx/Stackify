import {React, useState, useEffect} from 'react'
import { PaletteIcon } from 'lucide-react'


const THEMES = [
    "light",
    "dark"
]

function ThemeSelector() {
    const [Theme, setTheme] = useState(() => {
        if (typeof window !== "undefined"){
            return localStorage.getItem("theme") || "Light"
        }

        return "Light"
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", Theme);
        localStorage.setItem("theme", Theme)
    }, [Theme])

  return (
    <div className='dropdown dropdown-end'>
        <div tabIndex={0} role='button' className='btn btn-ghost btn-sm gap-1'>
            <PaletteIcon className='size-4'/>
            <span className='hidden sm:inline'>Theme</span>
        </div>
        <ul tabIndex={0} className='dropdown-content menu bg-base-200 rounded-box z-50 w-56 p-2 shadow-xl max-h-96 overflow-y-auto flex-nowrap'>
            {THEMES.map((t) => (
                <li key={t}>
                    <button onClick={() => setTheme(t)} className={`flex justify-between ${ Theme === t ? "bg-primary-content" : ""}`}>
                        <span className='capitalize'>{t}</span>
                        <div className='flex gap-0.5' data-theme={t}>
                            <span className='w-2 h-4 rounded-sm bg-primary'></span>
                            <span className='w-2 h-4 rounded-sm bg-secondary'></span>
                            <span className='w-2 h-4 rounded-sm bg-accent'></span>
                            <span className='w-2 h-4 rounded-sm bg-neutral'></span>

                        </div>
                    </button>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default ThemeSelector