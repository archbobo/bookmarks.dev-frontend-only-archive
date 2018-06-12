
import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Bookmark} from '../../../core/model/bookmark';

@Injectable()
export class BookmarkSearchService {

  private bookmarksUrl = 'http://localhost:3000/bookmarks';  // URL to web api

  constructor(private http: Http) { }

  search(term: string): Observable<Bookmark[]> {
    const response = this.http
        .get(`${this.bookmarksUrl}/?term=${term}`).pipe(
        map((res: Response) => res.json()),
        catchError((error: any) => observableThrowError(error.json().error || 'Server error')),);

    return response;
  }

  advancedSearch(term: string): Observable<Bookmark[]> {
    let searchQuery = '?name=' + term;
    if (term.includes('(')){
      const regExpCategory = new RegExp('\[(.*?)\]');
      const searchTextCategoryMatches = regExpCategory.exec(term);
      if (searchTextCategoryMatches.length > 0){
        searchQuery += 'category=' + searchTextCategoryMatches[0];
      }

      const regExpTags = new RegExp('\((.*?)\)');
      const searchTextTagMatches = regExpTags.exec(term);
      if (searchTextTagMatches.length > 0){
        searchQuery += 'tag=' + searchTextTagMatches[0];
      }
    }

    const response = this.http
      .get(`${this.bookmarksUrl}${searchQuery}`).pipe(
      map((res: Response) => res.json()),
      catchError((error: any) => observableThrowError(error.json().error || 'Server error')),);

    return response;
  }
}
