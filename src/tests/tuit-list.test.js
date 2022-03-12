import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

const MOCKED_USERS = ["alice", "bob", "charlie"];

const MOCKED_TUITS = ["alice's tuit", "bob's tuit", "charlie's tuit"];

const MOCKED_DATA = MOCKED_USERS.map((user, i) => {
    return {postedBy: {_id: i, username: user}, tuit: MOCKED_TUITS[i]};
});

test("tuit list renders static tuit array", async () => {
    render(
        <HashRouter>
            <Tuits tuits={MOCKED_DATA} />
        </HashRouter>
    );
    MOCKED_TUITS.forEach((tuit) => {
        const element = screen.getByText(tuit);
        expect(element).toBeInTheDocument();
    });
});

test("tuit list renders async", async () => {
    const response = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={response} />
        </HashRouter>
    );
    response.forEach((tuit) => {
        const element = screen.getByText(tuit.tuit);
        expect(element).toBeInTheDocument();
    });
});

test("tuit list renders mocked", async () => {
    const mock = jest.spyOn(axios, "get");
    mock.mockImplementation(() =>
        Promise.resolve({data: MOCKED_USERS.map((user, i) => {return { postedBy: user, tuit: MOCKED_TUITS[i] };}),})
    );
    const data = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={data} />
        </HashRouter>
    );
    MOCKED_TUITS.forEach((tuit) => {
        const element = screen.getByText(tuit);
        expect(element).toBeInTheDocument();
    });
});


