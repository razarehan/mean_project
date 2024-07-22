import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, NavigationExtras } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'first post', content: 'this is my first post'},
  //   {title: 'second post', content: 'this is my second post'},
  //   {title: 'third post', content: 'this is my third post'},
  //   {title: 'fourth post', content: 'this is my fourth post'},
  //   {title: 'fifth post', content: 'this is my fifth post'},
  // ]
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 3;
  posts: Post[] = [];
  isLoggedIn = false;
  userId:string | undefined;
  private postsSubscription = new Subscription();
  private authStatusSub = new Subscription();

  constructor(private postsService: PostsService, 
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.postsSubs.subscribe(
      (posts:Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      }
    )
    this.isLoggedIn = this.authService.getIsAuth();
    console.log('Simple--->'+ this.isLoggedIn);
    
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticate => {
      this.isLoggedIn = isAuthenticate;
      this.userId = this.authService.getUserId();
      console.log('Observable--->'+ this.isLoggedIn);
    })
  }
  ngOnDestroy(): void {
    this.postsSubscription .unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDeletePost(id: string) {
    this.postsService.deletePost(id);
  }

  viewPost(id: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(['/view', id], navigationExtras);
  }
}
