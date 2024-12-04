import { IAspect, ITaggable, TagManager } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export type Tags = { [key: string]: string } & {
    environment: 'development' | 'staging' | 'production' | 'feature';
    project: string;
    owner: string;
};

export class ApplyTags implements IAspect {
  #tags: Tags;

  constructor(tags: Tags) {
    this.#tags = tags;
  }

  visit(node: IConstruct) {
    if (TagManager.isTaggable(node)) {
        Object.entries(this.#tags).forEach(([key, value]) => {
            console.log(`Applying tag ${key}=${value} to ${node.node.path}`);
            (node as ITaggable)?.tags.setTag(key, value);
        });
    }
  }
}
