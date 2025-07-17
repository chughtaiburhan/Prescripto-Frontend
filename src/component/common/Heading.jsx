import React from 'react'

const Heading = ({
    text,
    size = 2,
    color = 'gray-800',
    align = 'center',
    weight = 'medium',
    className = '',
    children
}) => {
    const sizeClasses = {
        xs: 'text-xs', sm: 'text-sm',
        base: 'text-base', lg: 'text-lg', xl: 'text-xl',
        2: 'text-2',
        3: 'text-3',
        4: 'text-4',
        5: 'text-5'
    }

    const colorClasses = {
        'gray-600': 'text-gray-600',
        'gray-700': 'text-gray-700',
        'gray-800': 'text-gray-800',
        'gray-900': 'text-gray-900',
        'blue-600': 'text-blue-600',
        'blue-700': 'text-blue-700',
        'white': 'text-white'
    }

    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    const weightClasses = {
        normal: 'font-normal',
        medium: 'font-medium',
        'semibold': 'font-semibold',
        bold: 'font-bold'
    }

    return (
        <h1 className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      ${alignClasses[align]} 
      ${weightClasses[weight]}
      ${className}
    `}>
            {text || children}
        </h1>
    )
}

export default Heading 