import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {compose} from "redux";
import { filterUsers } from '../actions/users';
import Search from "./Search";

class SearchContainer extends PureComponent {

    render() {
        return (<>
                <Search filterUsers={this.props.filterUsers}/>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
};

const dispatchToProps = (dispatch) => ({
    filterUsers: (searchText) => dispatch(filterUsers(searchText))
  });

export default connect(mapStateToProps,dispatchToProps)(SearchContainer);
