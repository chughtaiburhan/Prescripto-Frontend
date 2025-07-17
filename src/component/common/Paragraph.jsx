import React from 'react'

const Paragraph = ({
    text,
    size = 'base',
    color = 'gray-600',
    align = 'center', width = 'full',
    className = '',
    children
}) => {
    const sizeClasses = {
        xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl'
    }

    const colorClasses = {
        gray: {
            500: 'text-gray-500', 600: 'text-gray-600', 700: 'text-gray-700', 800: 'text-gray-800'
        },
        blue: {
            600: 'text-blue-600'
        },
        white: 'text-white'
    }

    const alignClasses = {
        left: 'text-left', center: 'text-center', right: 'text-right'
    }

    const widthClasses = {
        full: 'w-full',
        '11/12': 'w-11/12',
        '2/3': 'w-2/3',
        '1/2': 'w-1/2',
        '1/3': 'w-1/3'
    };


    return (
        <p className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      ${alignClasses[align]} 
      ${widthClasses[width]}
      mx-auto
      ${className}
    `}>
            {text || children}
        </p>
    )
}

export default Paragraph 