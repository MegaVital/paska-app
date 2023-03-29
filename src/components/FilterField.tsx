import React, { FunctionComponent, useState } from "react";
import { DataFilters } from "../types";
import './components.css'
import { Button, Card, Grid, Box, Checkbox, FormControlLabel, List, ListItem, ListItemText, Slider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addFilter, addPrice, filterShift } from "../redux/dataReducer";
import { filter } from "../service.helper";


type FilterComponentProps = {}

export const FilterComponent: FunctionComponent<FilterComponentProps> = () => {

    const dispatcher = useAppDispatch()
    const data = useAppSelector(state => state.persistedReducer.dataSlice.data)
    const filteredData = useAppSelector(state => state.persistedReducer.dataSlice.filter)
    const price = useAppSelector(state => state.persistedReducer.dataSlice.price)

    const handleChangeCheckbox = (containName: string, propertyName: string) => {
        dispatcher(addFilter({ containName, propertyName }))
    };
    const dataPrice = data.map(el => el.price)
    const max = Math.max(...dataPrice)
    const min = Math.min(...dataPrice)
    const [slider, setSlider] = useState<number[]>(price)
    const handleChangeSlider = (event: Event, newPrice: number | number[]) => {
        setSlider(newPrice as number[]);
    };
    const applyPrice = () => {
        dispatcher(addPrice(slider))
    }

    return (
        <Box sx={{ minWidth: '300px' }} role="presentation" >
            {filter.map((filterItem) => (
                (filterItem.name === 'Brand' || filterItem.name === 'Size' || filterItem.name === 'Material') ? (
                    <Card raised sx={{
                        display: 'inherit', justifyContent: 'left', margin: 3, padding: 3
                    }}
                        key={filterItem.name}>
                        <Accordion sx={{ display: "contents" }} >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemText primary={filterItem.name} />
                                    </ListItem>
                                </List>
                            </AccordionSummary>
                            {
                                filterItem.contain.map((checkboxName) =>
                                    < AccordionDetails key={checkboxName}>
                                        <FormControlLabel
                                            label={checkboxName}
                                            control={<Checkbox
                                                checked={filteredData[filterItem.name as keyof DataFilters].includes(checkboxName)}
                                                onChange={() => handleChangeCheckbox(checkboxName, filterItem.name)} />}
                                        />
                                    </AccordionDetails>
                                )
                            }
                        </Accordion>
                    </Card>) : null
            ))}
            <Card raised sx={{ display: 'inherit', margin: 3, padding: 3 }}>
                <Accordion sx={{ display: "contents" }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header">
                        <List>
                            <ListItem disablePadding>
                                <ListItemText>
                                    Price
                                </ListItemText>
                            </ListItem>
                        </List>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Slider
                            disableSwap
                            getAriaLabel={() => 'Price'}
                            valueLabelDisplay="on"
                            min={min}
                            max={max}
                            onChange={handleChangeSlider}
                            value={slider}
                        />
                        <Button variant="contained" color='primary' size='medium'
                            onClick={applyPrice}
                            sx={{ width: '30px', justifySelf: 'right' }}>Apply</Button>
                    </AccordionDetails>
                </Accordion>
            </Card>
            <Grid sx={{ width: 200, display: 'grid' }}>
                <Button variant="contained" size='medium'
                    onClick={() => {
                        dispatcher(filterShift())
                        setSlider([min, max])
                    }}
                    sx={{ width: 'auto', justifySelf: 'center', mt: '10px' }}>Clear filter</Button>
            </Grid>
        </Box>)
}