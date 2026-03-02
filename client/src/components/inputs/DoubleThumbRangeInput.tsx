"use client";

import { useEffect, useRef, useState } from "react";
import styles from './input.module.css';

type RangeInputProps = {
    inputName: string;
    inputId: string;
    defaultMinThumbValue: number;
    defaultMaxThumbValue: number;
    min: number;
    max: number;
    step: number;
    onChange: (lowerbound: number, upperbound: number) => void;
}

/**
 * Renders a double thumb range input.\
 * Setting initial values where defaultMinThumb > defaultMaxThumb will result in undefined behaviour.
 * 
 * @param param0 the props:
 * - `inputName (string)`: the text to describe the number input
 * - `inputId (string`): this uses a label-input underneath, so an id is needed to bind label's htmlFor to input's ID
 * - `defaultMinThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
 * - `defaultMaxThumb (number)`: the default value for the min thumb, note that the user has to ensure this already bounded between `min` and `max`. 
 * - `min (number)`: the smallest value the input can hold, inclusive
 * - `max (number)`: the largest value the input can hold, inclusive
 * - `step (number)`: after finish dragging the slider, snaps to the nearest multiple of this value. Do not pass 0 into this.
 * - `onChange (number, number => void)`: the function that is applied on the new lowerbound and upperbound inputs
 * @returns 
 */
export default function DoubleThumbRangeInput({ inputName, defaultMinThumbValue, defaultMaxThumbValue, min, max, step, onChange }: RangeInputProps) {
    const [minValue, setMinValue] = useState(defaultMinThumbValue);
    const [maxValue, setMaxValue] = useState(defaultMaxThumbValue);

    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const minThumbRef = useRef<HTMLDivElement>(null);
    const maxThumbRef = useRef<HTMLDivElement>(null);
    const selectedRangeRef = useRef<HTMLDivElement>(null);
    
    // Refs to track current values for event handlers
    const minValueRef = useRef(minValue);
    const maxValueRef = useRef(maxValue);
    
    // Keep refs in sync with state
    useEffect(() => {
        minValueRef.current = minValue;
        maxValueRef.current = maxValue;
    }, [minValue, maxValue]);

    // slider logic
    useEffect(() => {
        let isDragging = false;

        // logic for the min thumb
        function onDragMin(e: MouseEvent) {
            if (!isDragging || !sliderRef.current || !trackRef.current || !minThumbRef.current || !maxThumbRef.current) {
                return;
            }

            const rect = sliderRef.current.getBoundingClientRect();
            const xMin = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
            const percentMin = xMin / rect.width;

            const maxThumbLeft = maxThumbRef.current.getBoundingClientRect().left;
            const xMax = Math.min(Math.max(maxThumbLeft - rect.left, 0), rect.width);
            const percentMax = xMax / rect.width;

            const exactMinValue = min + Math.min(percentMin, percentMax) * (max - min);
            const minValueSnapToStep = Math.round(exactMinValue / step) * step;
            setMinValue(minValueSnapToStep);

            minThumbRef.current.style.left = `${Math.min(percentMin, percentMax) * 100}%`;
        }

        function stopDragMin() {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMin);
            document.removeEventListener('mouseup', stopDragMin);
            onChange(minValueRef.current, maxValueRef.current);
        }

        function startDragMin() {
            isDragging = true;
            document.addEventListener('mousemove', onDragMin);
            document.addEventListener('mouseup', stopDragMin);
        }

        const minThumb = minThumbRef.current;
        minThumb?.addEventListener('mousedown', startDragMin);

        // logic for the max thumb
        function onDragMax(e: MouseEvent) {
            if (!isDragging || !sliderRef.current || !trackRef.current || !minThumbRef.current || !maxThumbRef.current) {
                return;
            }

            const rect = sliderRef.current.getBoundingClientRect();
            const xMax = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
            const percentMax = xMax / rect.width;

            const minThumbRight = minThumbRef.current.getBoundingClientRect().right;
            const xMin = Math.min(Math.max(minThumbRight - rect.left, 0), rect.width);
            const percentMin = xMin / rect.width;

            const exactMaxValue = min + Math.max(percentMin, percentMax) * (max - min);
            const maxValueSnapToStep = Math.round(exactMaxValue / step) * step;
            setMaxValue(maxValueSnapToStep);

            maxThumbRef.current.style.left = `${Math.max(percentMin, percentMax) * 100}%`;
        }

        function stopDragMax() {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMax);
            document.removeEventListener('mouseup', stopDragMax);
            onChange(minValueRef.current, maxValueRef.current);
        }

        function startDragMax() {
            isDragging = true;
            document.addEventListener('mousemove', onDragMax);
            document.addEventListener('mouseup', stopDragMax);
        }

        const maxThumb = maxThumbRef.current;
        maxThumb?.addEventListener('mousedown', startDragMax);

        return () => {
            minThumb?.removeEventListener('mousedown', startDragMin);
            maxThumb?.removeEventListener('mousedown', startDragMax);
        }
    }, [max, maxValue, min, minValue, onChange, step]);

    // the slider must also respond to a change in value via button
    // at the same time, this will set the slider position at the default value
    useEffect(() => {
        const minPercent = (minValue - min) / (max - min);
        const maxPercent = (maxValue - min) / (max - min);

        if (!minThumbRef.current || !maxThumbRef.current || !selectedRangeRef.current) {
            return;
        }

        minThumbRef.current.style.left = `${minPercent * 100}%`;
        maxThumbRef.current.style.left = `${maxPercent * 100}%`;
        selectedRangeRef.current.style.width = `${(maxPercent - minPercent) * 100}%`;
        selectedRangeRef.current.style.left = `${(minPercent) * 100}%`;
    }, [max, maxValue, min, minValue, step]);

    return (
        <div className={styles.rangeInput}>
            <p className={styles.rangeInputDescription}>{inputName}</p>
            <div className={styles.sliderAndValue}>
                <div className={styles.lower}>{String(minValue).padStart(4, '0')}</div>
                <div className={styles.slider} ref={sliderRef}>
                    <div className={styles.sliderTrack} ref={trackRef}></div>
                    <div className={styles.sliderMinThumb} ref={minThumbRef}></div>
                    <div className={styles.selectedRange} ref={selectedRangeRef}></div>
                    <div className={styles.sliderMaxThumb} ref={maxThumbRef}></div>
                </div>
                <div className={styles.higher}>{String(maxValue).padStart(4, '0')}</div>
            </div>
        </div>
    )
}