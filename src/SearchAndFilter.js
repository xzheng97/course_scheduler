class SearchAndFilter {
  searchAndFilter(courses, tagList, filter) {
    if(tagList.length === 0) {
      return courses;    
    }

    let coursesAfterSearch = [];
    if(filter ==='intersection of tags'){
      for(const course of Object.values(courses)) {
        let flag = true;
        tagList.forEach(tag => {
          if(!course.keywords.includes(tag)) {
            flag = false;
          }
        });
        if (flag === true) {
          coursesAfterSearch.push(course);
        }
    
      }
      courses = coursesAfterSearch;
    }
    else {
      for(const course of Object.values(courses)) {
        for (const tag of tagList) {
          if(course.keywords.includes(tag)){
            coursesAfterSearch.push(course);
            break;
          }
        }
      }
      courses = coursesAfterSearch;
    }
  
    return courses;
  }
}

export default SearchAndFilter;
