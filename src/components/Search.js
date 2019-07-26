import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { ReactiveList } from '@appbaseio/reactivesearch';
// styles
import theme from '../styles/theme';
import Navbar from '../styles/Navbar_for_search';
import ResultItem, { resultItemDetails } from '../styles/ResultItem';

import {
	DataSearch,
	SingleDropdownList,
} from '@appbaseio/reactivesearch';

import Flex, { FlexChild } from '../styles/Flex';

function Search(){
    const Header = () => {
        // block body
        return (<Navbar>食品營養成分搜尋(每100g)</Navbar>)
    }
    const customQuery = (value,props) =>{
        if (value) {
          // if valid value, return your query
          // full-text query
          console.log('customQuery-value',value)
          const query_lan = {
            query: {
                match: {
                    food_name: value
                    }
                }
            }  
        console.log('customQuery-query_lan',query_lan)
        return query_lan    
        }  
        // otherwise return null query
        return null
      }
    const SearchFilters = () => (
        // concise body
        <Flex responsive style={{ padding: '1rem' }}>
            <FlexChild flex={2}>
                <DataSearch
                    componentId="searchbox"
                    dataField={["food_name"]}
                    placeholder="Search for macros"
                    customHighlight={() => ({
                        highlight: {
                            pre_tags: ['<mark>'],
                            post_tags: ['</mark>'],
                            fields: {
                                food_name: {},
                            },
                            number_of_fragments: 0,
                        },
                    })}
                    customQuery={customQuery}
                />
            </FlexChild>
            <FlexChild flex={1}>
                <SingleDropdownList
                    componentId="category_filter"
                    dataField="categories.keyword"
                    placeholder="Select Category"
                    react={{
                        and: 'food_name',
                    }}
                />
            </FlexChild>
        </Flex>
    );
    
    const renderResultStats = ({ numberOfResults, time }) => (
        <Flex justifyContent="flex-end" style={{ padding: '0 1rem' }}>
            {numberOfResults} results found in {time}ms
        </Flex>
    )
    
    const onData = (data) => {
        // block body
        console.log(data)
        console.log('renderItem',data.food_name)
        // console.log('all properties', Object.keys(data))
        return (
        <ResultItem key={data._id}>
            <div dangerouslySetInnerHTML={{ __html: data.food_name }} />
            <Flex className={resultItemDetails} style={{ paddingTop: 5, marginTop: 5 }}>
                <FlexChild>{data.categories} </FlexChild>
                <FlexChild>熱量 {data.calories} kcal</FlexChild>
                <FlexChild>碳水 {data.carbs} g</FlexChild>
                <FlexChild>蛋白質 {data.protein} g</FlexChild>
                <FlexChild>脂肪 {data.fat} g</FlexChild>
            </Flex>
        </ResultItem>
        )
    }

    const Results = () => (
        // ReactiveList is data-driven result list UI component
        <ReactiveList
            componentId="results"
            dataField="categories.keyword"
            renderItem={onData} // returns a list element object to be rendered based on the res data object.
            renderResultStats={renderResultStats}
            react={{
                and: ["searchbox","category_filter"],
            }}
            pagination
        />
    );

    return (
        <div className="container">
            {/* ReactiveBase: a backend connector where we can configure the Elasticsearch index */}
            <ReactiveBase
            app="macros"
            url="http://localhost:9200"
            theme = {theme}
            > 
                {/* other components will go here. */}
                <Header />
                <SearchFilters />
                <Results />
            </ReactiveBase> 
        </div>      
    )
}
export default Search