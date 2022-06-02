import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { getteam, httpGet, httpPut, postteam } from "../config/config";
import uefa from "../pages/uefa.png";
import "../css/Teams.css";

const TeamList = ({ socket }) => {
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [clickedItem, setclickedItem] = useState(null);

  const socketListener = () => {
    socket.on("clickedItem", ({ team, teams }) => {
      addToGroup(team, teams);
    });
  };
  useEffect(() => {
    httpGet("/api/teams")
      .then((success) => {
        setTeams(success.teams);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    socketListener();
    return () => socket.off("clickedItem");
  }, [teamA, teamB]);

  function addToGroup(team, teams) {
    setclickedItem(team);

    if (teamA.length > teamB.length) {
      setTeamB([...teamB, team.name]);
    } else {
      setTeamA([...teamA, team.name]);
    }
    // if (teams.length && team) {

    setTeams(teams);
    // }
  }

  // const onGetGroup = () => {
  //   httpGet("api/fixture/group/A").then(console.log);
  // };
  //const t1 =["barcelona","madrid","liverpool","bayern","chealsea","tottenham","arsenal","acmilan","intermilan","Lazio"]

  const clickHander = async (e) => {
    e.preventDefault();
    const teamId = e.target.getAttribute("teamid");
    const tm = teams.find((t) => t._id === teamId);
    let tms = teams.filter((team) => team._id !== tm._id);
    if (localStorage.getItem("isOrganizer")) {
      addToGroup(tm, tms);
      await httpPut(`/api/teams/assign/${teamId}`, {
        group: teamA.length > teamB.length ? "B" : "A",
      });
      socket.emit("clickedItem", {
        team: tm,
        teams: tms,
      });
    }
    return;
  };

  const onGetFixture = () => {
    httpGet("/api/fixture").then(console.log);
  };
  return (
    <div>
      <p id="name">TEAMS FOR DRAW</p>
      <div className="maincontainer">
        {teams.map((team1, index) => {
          return (
            <div
              key={team1._id}
              teamid={team1._id}
              className={`maindiv ${
                clickedItem?._id === team1._id ? " flip" : ""
              }`}
              style={{ border: " 1px solid black" }}
              onClick={clickHander}
            >
              <p className="container">{team1.name}</p>
            </div>
          );
        })}
      </div>

      <div className="group">
        <div className="A">
          GROUP A
          {teamB.map((t, i) => {
            return <div key={i}>{t}</div>;
          })}
        </div>
        <div className="B">
          GROUP B
          {teamA.map((t, i) => {
            return <div key={i}>{t}</div>;
          })}
        </div>
      </div>
      <button onClick={onGetFixture}>Get All Fixture</button>
    </div>
  );
};

export default TeamList;
