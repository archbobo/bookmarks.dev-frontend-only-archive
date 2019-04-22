import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Bookmark } from '../core/model/bookmark';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { PersonalBookmarksStore } from '../core/store/personal-bookmarks-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData } from '../core/model/user-data';
import { UserDataStore } from '../core/user/userdata.store';
import { UserDataService } from '../core/user-data.service';
import { MatTabChangeEvent } from '@angular/material';
import { WatchedTagsComponent } from '../shared/watched-tags/watched-tags.component';

@Component({
  selector: 'app-user-bookmarks',
  templateUrl: './personal-bookmarks-list.component.html',
  styleUrls: ['./personal-bookmarks-list.component.scss']
})
export class PersonalBookmarksListComponent implements OnInit {

  @ViewChild(WatchedTagsComponent)
  private watchedTagsComponent: WatchedTagsComponent;

  personalAndStarredBookmarks$: Observable<List<Bookmark>>;
  laterReads$: Observable<Bookmark[]>;
  starredBookmarks$: Observable<Bookmark[]>;

  query = '';
  userData: UserData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalBookmarksStore: PersonalBookmarksStore,
    private userDataStore: UserDataStore) {
  }

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get('q');
    if (this.query) {
      this.query = this.query.replace(/\+/g, ' ');
    } else {
      this.query = this.route.snapshot.queryParamMap.get('search');
      if (this.query) {
        this.query = this.query.replace(/\+/g, ' ');
      }
    }
    this.personalAndStarredBookmarks$ = this.personalBookmarksStore.getPersonalBookmarks();
    this.userDataStore.getUserData().subscribe(data => {
        this.userData = data;
      },
      error => {
      }
    );
  }

  tabSelectionChanged(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.laterReads$ = this.userDataStore.getLaterReads();
    } else if (event.index === 2) {
      this.starredBookmarks$ = this.userDataStore.getStarredBookmarks();
    } else if (event.index === 3) {
      this.watchedTagsComponent.loadBookmarksForWatchedTags();
    }
  }
}