import React, { useEffect, useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Button,
    ButtonGroup,
    Typography,
} from "@mui/material";

function BiddingTable({
    bdeList,
    setBdeList,
    resultsList,
    setResultsList,
    pointList,
    setPointList,
    creditScore,
}) {
    const [dummyPointList, setDummyPointList] = useState([]);
    const [creditAllocationValidity, setCreditAllocationValidity] =
        useState(false);

    function getPoints(courseCode) {
        setPointList(dummyPointList);
        const courseIndexInPointList = pointList.findIndex(
            (element) => element.courseCode === courseCode
        );
        return courseIndexInPointList === -1
            ? 0
            : pointList[courseIndexInPointList].points;
    }

    //edit here to get the 2 data values
    const handleSubmit = (event) => {
        console.log("Handle Submit called");
        setPointList(dummyPointList);
        const newResultsList = bdeList.map((element) => ({
            //TODO: Change options
            courseCode: element.courseCode,
            courseName: element.courseName,
            creditsAllocated: getPoints(element.courseCode),
            status: "Awaiting resultsList",
        }));
        setResultsList(newResultsList);
    };

    // Delete course code from resultsList, pointList, bdeList
    const handleDelete = (deletedCourseCode) => {
        console.log("Handle Delete called");

        const newResultsList = resultsList.filter(
            //TODO: Change options
            (element) => element.courseCode != deletedCourseCode
        );
        setResultsList(newResultsList);

        const newPointList = pointList.filter(
            (element) => element.courseCode !== deletedCourseCode
        );
        setPointList(newPointList);
        setDummyPointList(pointList);

        const newBdeList = bdeList.filter(
            //TODO: Change options
            (element) => element.courseCode != deletedCourseCode
        );
        setBdeList(newBdeList);
    };

    // Tracks credits allocated to each bde course code
    const handlePointChange = (event, editedCourseCode) => {
        console.log(editedCourseCode);

        const newPointList = [...dummyPointList];
        const editedCourseIndex = newPointList.findIndex(
            (element) => element.courseCode === editedCourseCode
        );
        if (editedCourseIndex !== -1) {
            newPointList[editedCourseIndex].points = event.target.value;
        } else {
            newPointList.push({
                courseCode: editedCourseCode,
                points: event.target.value,
            });
        }

        newPointList.editedCourseCode = event.target.value;

        let cur_allocated_credits = 0;
        dummyPointList.forEach((element) => {
            cur_allocated_credits += element.points;
        });

        setCreditAllocationValidity(cur_allocated_credits <= creditScore);
        setDummyPointList(newPointList);
    };

    //Updates whenever theres changes
    useEffect(() => {
        console.log("dummyPointList");
        console.log(dummyPointList);
    }, [dummyPointList]);

    useEffect(() => {
        console.log("pointList");
        console.log(pointList);
    }, [pointList]);

    useEffect(() => {
        console.log("resultsList");
        console.log(resultsList);
    }, [resultsList]);
    // When there is new BDEs added, set point to default 0, unless there is already points prior

    useEffect(() => {
        console.log("bdeList");
        console.log(bdeList);
        const newPointList = bdeList.map((element) => ({
            courseCode: element.courseCode,
            points: getPoints(element.courseCode),
        }));
        setPointList(newPointList);
    }, [bdeList]);

    useEffect(() => {
        console.log("creditAllocationValidity");
        console.log(creditAllocationValidity);
    }, [creditAllocationValidity]);

    return (
        <div>
            <List>
                {bdeList.map((elem) => (
                    //TODO: Change options
                    <ListItem className="flex pt-4">
                        <ListItemText>
                            <Typography>
                                {elem.courseCode} {elem.courseName}{" "}
                                {creditScore}{" "}
                                {creditAllocationValidity.toString()}
                            </Typography>
                        </ListItemText>
                        <input
                            className="w-48 pr-4"
                            type="number"
                            placeholder="Allocate Points..."
                            defaultValue={getPoints(elem.courseCode)}
                            onChange={(e) =>
                                handlePointChange(e, elem.courseCode)
                            }
                        />
                        <ButtonGroup>
                            <Button
                                text="text"
                                aria-label="submit"
                                edge="end"
                                onClick={handleSubmit}
                                disabled={!creditAllocationValidity}
                            >
                                Submit
                            </Button>
                            <Button
                                text="text"
                                aria-label="submit"
                                edge="end"
                                onClick={() => handleDelete(elem.courseCode)}
                            >
                                Delete
                            </Button>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default BiddingTable;
