import React, { useState } from 'react'
import { Textarea } from '@heroui/input'

interface TextAreaProps {
    label: string
    variant?: "bordered" | "flat" | "faded" | "underlined"
    maxLength: number 
    onValueChange?: (value: string) => void
    ref?: React.Ref<HTMLTextAreaElement>
    value?: string
    defaultValue?: string
    isDisabled?: boolean
}

const TextArea: React.FC<TextAreaProps> = ({ label, variant, maxLength, onValueChange, ref, defaultValue, value, isDisabled }) => {
    const [valueConsulta, setValueConsulta] = useState('')

    return (
        <Textarea onValueChange={(e: string) => { setValueConsulta(e); if(onValueChange) onValueChange(e) }} maxRows={4} ref={ref} defaultValue={defaultValue} 
        label={label} labelPlacement='inside' isDisabled={isDisabled} value={value} variant={variant} maxLength={maxLength} isClearable endContent={
            <span className='absolute top-2 end-8 text-xs'>{valueConsulta.length || defaultValue?.length} / {maxLength}</span>} />
    )
}

export default TextArea
