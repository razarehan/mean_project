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
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 3;
  posts: Post[] = [];
  isLoggedIn = false;
  userId:string | undefined;
  creatorMap = new Map();

  private postsSubscription = new Subscription();
  private authStatusSub = new Subscription();

  constructor(private postsService: PostsService, 
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService.getPosts();
    this.postsSubscription = this.postsService.postsSubs
    .subscribe((posts:Post[]) => {
      this.isLoading = false;
      this.posts = posts;
      // fetch creator list
      this.posts.forEach(post => {
        this.authService.getUserameById(post.creator)
          .subscribe((res) => {
            if(!res.name) {
              res.name = "Anonymous"
            }
            this.creatorMap.set(post.creator, res.name);
          })
      })
    })
    this.isLoggedIn = this.authService.getIsAuth();
    
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticate => {
      this.isLoggedIn = isAuthenticate;
      this.userId = this.authService.getUserId();
    });
  }
  ngOnDestroy(): void {
    this.postsSubscription .unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDeletePost(id: string) {
    this.postsService.deletePost(id);
  }

  viewPost(id: string, creator: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: id,
        creator: creator
      }
    };
    this.router.navigate(['/view', id], navigationExtras);
  }
}
