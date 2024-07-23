import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  postId!: string; 
  post!: Post;
  isLoading = true;
  constructor(private route: ActivatedRoute,
              private postsService: PostsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (window.history.state.id) {
        this.postId = window.history.state.id;
      }
      this.route.params.subscribe((params: Params) => { // if user hit refresh
        this.postId = params['postId'];
      });
    });

    this.postsService.getPost(this.postId)
      .pipe(map((postdata) => {
        return {
          id: postdata.post._id,
          title: postdata.post.title,
          content: postdata.post.content,
          creator: postdata.post.creator
        }
      }))
      .subscribe((transformedData) => {
        this.post = transformedData;
        this.isLoading = false;
      })
  }
  goBack() {
    window.history.back();
  }
}
