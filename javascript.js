//Import React libraries
import React from "react";
import ReactDOM from "react-dom";


//Add and remove the downward caret on to show user which list is being displayed
$(".app").on("click", ".recent_list", function() {
  $(".r_point").remove();
  $(".recent_list").append("<span class='r_point'> &#9660;</span>");
  $(".a_point").remove();
});


$(".app").on("click", ".alltime_list", function() {
  $(".a_point").remove();
  $(".alltime_list").append("<span class='a_point'> &#9660;</span>");
  $(".r_point").remove();
});


//Create main App component
class App extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      month: ""
    }
    
    //Initialize the page with rankings from last 30 days.
    this.leaderboardSearch();
    
  } //End constructor
  
  
  //Create the function.
  //Update state to show rankings from last 30 days.
  leaderboardSearch () {
    
    $.get("https://fcctop100.herokuapp.com/api/fccusers/top/recent", (data) => {
        this.setState({ month: data });
    }); //End get request
    
  } //End leaderboardSearch
  
  //Render the <Table /> component
  //Pass down the anonymous "onChange" functions for use inside of <Table /> component
  render() {

    return (
      
      <div>
        <Table month={this.state.month} 
          onChangeAT={ () => {
                            $.get("https://fcctop100.herokuapp.com/api/fccusers/top/alltime", (data) => {
                                this.setState({ month: data })
                            }); //End get request
                        } //Anon function
                   } 
          onChangeNow={ () => {
                            $.get("https://fcctop100.herokuapp.com/api/fccusers/top/recent", (data) => {
                              this.setState({ month: data });
                            }); //End get request
                        } //Anon function

        } />
        
      </div>
     
    );
    
  } //End render

} //end App component


//Create the <Table /> component
var Table = (props) => {
    
    //Grab the variables that were passed from <App /> component
    var month = props.month;
    var display_month = [];
    
    //Loop over list of top users for the month (in month variable)
    //Add required info to the <Table_rows /> component
    //Push the entire component to display_month list
    for (var i in month) {
      display_month.push(<Table_rows key={i} rank={Number(i) + 1} user={ month[i] } />);
    }
  
    //Return the required JSX for the table
    //Add onClick listeners and call the functions that we passed down from <App />
    return (

        <table className="table table-striped">
              <tr className="table_header">
                <th>#</th>
                <th>Camper Name</th>
                <th className="recent_list" onClick={ () => props.onChangeNow() }><a>Points in last 30 days</a><span className="r_point"> &#9660;</span></th>
                <th className="alltime_list" onClick={ () => props.onChangeAT() }><a>Points all time</a></th>
              </tr>
           <tbody>
              {display_month}
          </tbody>
        </table>

      
    );

} //end table function


//Create the Table_rows component
var Table_rows = function (props) {
  
  //Pull out the variables that were passed down from <Table />
  var rank = props.rank;
  var username = props.user.username;
  var image = props.user.img;
  var month_points = props.user.recent;
  var forever_points = props.user.alltime;
  var profile_link = "https://www.freecodecamp.com/" + username;
  
  //Return required JSX with variables inserted
  return (
    <tr>
      <td>{rank}</td>
      <td className="table_username"><img className="avatar" src={image} /><a href={profile_link} target="_blank">  {username}</a></td>
      <td>{month_points}</td>
      <td>{forever_points}</td>
    </tr>
    
  );
  
}



//Render the entire <App /> component to the DOM
ReactDOM.render(<App />, document.querySelector(".app"));











