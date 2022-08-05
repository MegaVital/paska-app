import React, { FC } from "react";
import './components.css'

type Props = {
    text: string
    handlePressButton?: () => void
    additionalContainerStyle?: string
}

export const Button: FC<Props> = ({ text, handlePressButton, additionalContainerStyle }) => {


    return (
        <div onClick={handlePressButton ? handlePressButton : () => { }} className={`naviButton ${additionalContainerStyle}`}>
            <span className="buttonText">
                {text}
            </span>
        </div>
    )
}