import Text from '../../misc/Text';
import Thumbnail from '../../misc/Thumbnail';
import NavigationEndpoint from '../../NavigationEndpoint';
import MetadataBadge from '../../MetadataBadge';
import Parser from '../../../index';
import { YTNode } from '../../../helpers';

class LiveChatPaidMessage extends YTNode {
  static type = 'LiveChatPaidMessage';

  message: Text;

  author: {
    id: string;
    name: Text;
    thumbnails: Thumbnail[];
    badges: MetadataBadge[];
    is_moderator: boolean | null;
    is_verified: boolean | null;
    is_verified_artist: boolean | null;
  };

  purchase_amount: string;
  menu_endpoint: NavigationEndpoint;
  timestamp: number;
  timestamp_text: string;
  id: string;

  constructor(data: any) {
    super();
    this.message = new Text(data.message);

    this.author = {
      id: data.authorExternalChannelId,
      name: new Text(data.authorName),
      thumbnails: Thumbnail.fromResponse(data.authorPhoto),
      badges: Parser.parseArray<MetadataBadge>(data.authorBadges, MetadataBadge),
      is_moderator: null,
      is_verified: null,
      is_verified_artist: null
    };

    const badges = Parser.parseArray<MetadataBadge>(data.authorBadges, MetadataBadge);

    this.author.badges = badges;
    this.author.is_moderator = badges?.some((badge: any) => badge.icon_type == 'MODERATOR') || null;
    this.author.is_verified = badges?.some((badge: any) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED') || null;
    this.author.is_verified_artist = badges?.some((badge: any) => badge.style == 'BADGE_STYLE_TYPE_VERIFIED_ARTIST') || null;

    this.purchase_amount = new Text(data.purchaseAmountText).toString();
    this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
    this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1000);
    this.timestamp_text = new Text(data.timestampText).toString();
    this.id = data.id;
  }
}

export default LiveChatPaidMessage;